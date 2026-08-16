import re
import json
from apps.jobs.models import Resume
from .gemini_service import GeminiService

ACTION_VERBS = [
    "developed", "built", "architected", "engineered", "designed", "led",
    "optimized", "implemented", "spearheaded", "managed", "configured",
    "deployed", "created", "integrated", "transformed", "scaled", "automated"
]

DISCLAIMER_TEXT = (
    "Resume scores and ATS compatibility tips provide automated guidance based on standard industry heuristics. "
    "They do not guarantee job interviews or acceptance by proprietary ATS software."
)


class ResumeAnalyzerService:
    @staticmethod
    def analyze_resume(resume: Resume) -> dict:
        """
        Executes a complete Resume Analysis separating deterministic structural checks
        from validated AI-generated suggestions.
        """
        raw_text = resume.raw_text or f"{resume.name} {resume.skills} {resume.education} {resume.experience} {resume.projects}"
        
        # 1. Deterministic Structural Audit & Score
        deterministic_audit = ResumeAnalyzerService.perform_deterministic_audit(resume, raw_text)

        # 2. AI Suggestions (Strengths, Weaknesses, ATS Tips, Bullet Point Improvements)
        ai_suggestions = ResumeAnalyzerService.generate_ai_suggestions(raw_text, deterministic_audit)

        # 3. Combine & Attach Disclaimer
        return {
            "resume_id": resume.id,
            "resume_title": resume.title,
            "resume_score": deterministic_audit["score"],
            "deterministic_checks": deterministic_audit,
            "ai_suggestions": ai_suggestions,
            "disclaimer": DISCLAIMER_TEXT
        }

    @staticmethod
    def perform_deterministic_audit(resume: Resume, raw_text: str) -> dict:
        """
        Calculates a transparent, empirical structural score (0 to 100) based on section presence,
        contact information completeness, action verb usage, and length.
        """
        text_lower = raw_text.lower()
        missing_sections = []
        earned_points = 0

        # A. Contact Details Check (Max 30 pts)
        has_email = bool(resume.email or re.search(r'[\w\.-]+@[\w\.-]+\.\w+', raw_text))
        has_phone = bool(resume.phone or re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', raw_text))
        has_name = bool(resume.name and len(resume.name.strip()) > 2)

        contact_score = 0
        if has_name: contact_score += 10
        if has_email: contact_score += 10
        if has_phone: contact_score += 10

        if not (has_email and has_phone):
            missing_sections.append("Complete Contact Information (Phone / Email)")

        # B. Core Sections Audit (Max 50 pts)
        has_skills = bool(resume.skills or re.search(r'\b(skills|technical skills|competencies)\b', text_lower))
        has_experience = bool(resume.experience or re.search(r'\b(experience|work history|employment)\b', text_lower))
        has_education = bool(resume.education or re.search(r'\b(education|academic|degree)\b', text_lower))
        has_projects = bool(resume.projects or re.search(r'\b(projects|key projects|portfolio)\b', text_lower))

        section_score = 0
        if has_skills: section_score += 15
        else: missing_sections.append("Skills Section")

        if has_experience: section_score += 15
        else: missing_sections.append("Work Experience Section")

        if has_education: section_score += 10
        else: missing_sections.append("Education Section")

        if has_projects: section_score += 10
        else: missing_sections.append("Projects / Portfolio Section")

        # C. Action Verbs & Content Richness (Max 20 pts)
        found_verbs = [verb for verb in ACTION_VERBS if re.search(r'\b' + verb + r'\b', text_lower)]
        verb_count = len(found_verbs)
        
        if verb_count >= 5:
            verb_score = 20
        elif verb_count >= 3:
            verb_score = 15
        elif verb_count >= 1:
            verb_score = 10
        else:
            verb_score = 5

        words = raw_text.split()
        word_count = len(words)

        total_score = min(100, max(0, contact_score + section_score + verb_score))

        return {
            "score": total_score,
            "contact_completeness": {
                "name": has_name,
                "email": has_email,
                "phone": has_phone,
                "score": contact_score,
                "max": 30
            },
            "section_audit": {
                "has_skills": has_skills,
                "has_experience": has_experience,
                "has_education": has_education,
                "has_projects": has_projects,
                "score": section_score,
                "max": 50
            },
            "content_metrics": {
                "word_count": word_count,
                "action_verbs_found": found_verbs,
                "action_verbs_count": verb_count,
                "score": verb_score,
                "max": 20
            },
            "missing_sections": missing_sections
        }

    @staticmethod
    def generate_ai_suggestions(raw_text: str, audit_data: dict) -> dict:
        """
        Generates structured LLM / AI suggestions and validates JSON schema before returning.
        """
        raw_json_str = ""
        if GeminiService.is_available():
            prompt = (
                "Analyze the following resume text and provide structured JSON guidance.\n"
                "JSON format required:\n"
                "{\n"
                '  "strengths": ["string"],\n'
                '  "weaknesses": ["string"],\n'
                '  "skills_to_highlight": ["string"],\n'
                '  "ats_compatibility_tips": ["string"],\n'
                '  "bullet_point_improvements": [{"original": "string", "improved": "string", "reason": "string"}]\n'
                "}\n\n"
                f"Resume Text:\n{raw_text[:2000]}"
            )
            raw_json_str = GeminiService.generate_career_guidance(prompt)

        # Fallback structured suggestions if Gemini JSON is unconfigured or invalid
        fallback_suggestions = ResumeAnalyzerService._build_default_suggestions(raw_text, audit_data)

        if raw_json_str:
            try:
                # Clean markdown codeblocks if present
                clean_json = re.sub(r'^```json\s*|\s*```$', '', raw_json_str.strip(), flags=re.MULTILINE)
                parsed_json = json.loads(clean_json)
                return ResumeAnalyzerService.validate_ai_json_schema(parsed_json, fallback_suggestions)
            except Exception as e:
                print(f"[ResumeAnalyzerService Warning] Failed to parse Gemini JSON: {e}")

        return fallback_suggestions

    @staticmethod
    def validate_ai_json_schema(parsed_json: dict, fallback: dict) -> dict:
        """
        Strictly validates the AI JSON output structure, ensuring all required keys exist.
        """
        required_keys = ["strengths", "weaknesses", "skills_to_highlight", "ats_compatibility_tips", "bullet_point_improvements"]
        validated = {}

        for key in required_keys:
            val = parsed_json.get(key)
            if isinstance(val, list) and len(val) > 0:
                validated[key] = val
            else:
                validated[key] = fallback[key]

        return validated

    @staticmethod
    def _build_default_suggestions(raw_text: str, audit_data: dict) -> dict:
        """
        Default structured suggestions generator ensuring clean output out-of-the-box.
        """
        strengths = []
        if audit_data["contact_completeness"]["email"] and audit_data["contact_completeness"]["phone"]:
            strengths.append("Contact information is clearly provided at top of resume.")
        if audit_data["content_metrics"]["action_verbs_count"] >= 3:
            strengths.append(f"Effective use of strong action verbs ({', '.join(audit_data['content_metrics']['action_verbs_found'][:3])}).")
        if audit_data["section_audit"]["has_skills"]:
            strengths.append("Dedicated skills section present for quick technical scanning.")

        if not strengths:
            strengths.append("Resume provides basic readable structure.")

        weaknesses = []
        if audit_data["missing_sections"]:
            weaknesses.append(f"Missing core section(s): {', '.join(audit_data['missing_sections'])}.")
        if audit_data["content_metrics"]["word_count"] < 150:
            weaknesses.append("Resume content is short; expand on key technical project achievements and responsibilities.")
        if audit_data["content_metrics"]["action_verbs_count"] < 2:
            weaknesses.append("Descriptions rely on passive phrasing instead of strong action verbs.")

        if not weaknesses:
            weaknesses.append("Minor formatting refinements recommended to maximize impact.")

        skills_to_highlight = ["React.js", "Python", "Django", "PostgreSQL", "REST APIs", "Docker", "Git", "CI/CD"]
        
        ats_tips = [
            "Use standard single-column layout without embedded textboxes or graphic columns.",
            "Utilize standard section headers (e.g. 'Work Experience', 'Education', 'Technical Skills').",
            "Save resume as a PDF file with selectable text rather than an image scan.",
            "Incorporate exact target job description keywords naturally within project descriptions."
        ]

        bullet_point_improvements = [
            {
                "original": "Responsible for building backend services and writing APIs.",
                "improved": "Architected 5+ RESTful Django backend microservices handling 10,000+ daily API requests.",
                "reason": "Replaces passive duty statement with action verb 'Architected' and quantifies daily scale."
            },
            {
                "original": "Worked on frontend user interface with React.",
                "improved": "Engineered responsive React web application utilizing Tailwind CSS, reducing page load latency by 35%.",
                "reason": "Specifies technical stack and highlights measurable performance improvement metrics."
            }
        ]

        return {
            "strengths": strengths,
            "weaknesses": weaknesses,
            "skills_to_highlight": skills_to_highlight,
            "ats_compatibility_tips": ats_tips,
            "bullet_point_improvements": bullet_point_improvements
        }
