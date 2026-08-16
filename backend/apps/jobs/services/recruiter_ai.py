import re
import json
from apps.jobs.models import Job, JobApplication
from apps.jobs.services.job_matcher import JobMatcherService
from apps.ai_assistant.services.gemini_service import GeminiService

RECRUITER_DISCLAIMER = (
    "AI candidate rankings and summaries are assistive recommendations designed to streamline candidate review. "
    "They do not replace human recruiter evaluation or make automated hiring decisions."
)


class RecruiterAiService:
    @staticmethod
    def rank_applicants(job: Job, recruiter_user) -> dict:
        """
        Ranks all applicants for a specific job using transparent deterministic criteria,
        augmented with candidate qualification summaries and assistive disclaimers.
        """
        applications = job.applications.all().select_related('applicant')
        ranked_list = []

        for app in applications:
            applicant = app.applicant
            seeker_profile = getattr(applicant, 'seeker_profile', None)

            # 1. Deterministic Match Score Calculation
            match_data = JobMatcherService.calculate_match(job, applicant)

            # 2. AI Candidate Summary
            summary = RecruiterAiService.generate_candidate_summary(applicant, match_data)

            resume_url = None
            if app.resume:
                try:
                    resume_url = app.resume.url
                except Exception:
                    pass

            ranked_list.append({
                "application_id": app.id,
                "applicant_id": applicant.id,
                "applicant_name": seeker_profile.full_name if seeker_profile and seeker_profile.full_name else applicant.username,
                "email": applicant.email,
                "phone": seeker_profile.phone if seeker_profile else "",
                "applied_at": app.applied_at.strftime('%Y-%m-%d %H:%M'),
                "status": app.status,
                "status_display": app.get_status_display(),
                "resume_file": resume_url,
                "match_score": match_data["match_score"],
                "match_label": match_data["match_label"],
                "sub_scores": match_data["sub_scores"],
                "matching_skills": match_data["matching_skills"],
                "missing_skills": match_data["missing_skills"],
                "experience_match": match_data["experience_match"],
                "education_match": match_data["education_match"],
                "candidate_summary": summary,
                "recruiter_notes": app.recruiter_notes,
            })

        # Sort applicants by match score descending
        ranked_list.sort(key=lambda x: x["match_score"], reverse=True)

        # Assign Rank Badges (#1, #2, #3...)
        for idx, item in enumerate(ranked_list, start=1):
            item["rank"] = idx

        return {
            "job_id": job.id,
            "job_title": job.title,
            "total_applicants": len(ranked_list),
            "disclaimer": RECRUITER_DISCLAIMER,
            "applicants": ranked_list
        }

    @staticmethod
    def generate_candidate_summary(applicant, match_data: dict) -> str:
        """
        Generates a concise 2-sentence summary of candidate background and alignment.
        """
        seeker_profile = getattr(applicant, 'seeker_profile', None)
        name = seeker_profile.full_name if seeker_profile and seeker_profile.full_name else applicant.username
        
        matching = match_data.get("matching_skills", [])
        score = match_data.get("match_score", 0)
        exp = seeker_profile.experience if seeker_profile else ""
        
        raw_summary = ""
        if GeminiService.is_available():
            prompt = (
                f"Generate a 2-sentence summary of candidate {name} for a recruiter.\n"
                f"Candidate Skills: {', '.join(matching)}.\n"
                f"Experience Summary: {exp}.\n"
                f"Match Score: {score}%."
            )
            raw_summary = GeminiService.generate_career_guidance(prompt)

        if raw_summary:
            return raw_summary.strip()

        # Fallback Summary Generator
        skills_txt = ", ".join(matching[:3]) if matching else "core engineering practices"
        return (
            f"{name} is a {match_data.get('match_label', 'Qualified Candidate')} scoring {score}% match for this position. "
            f"Demonstrates strong proficiency in {skills_txt} with alignment across required seniority criteria."
        )

    @staticmethod
    def generate_or_enhance_job_description(title: str, skills_required: str = "", experience_required: str = "MID", current_description: str = "") -> dict:
        """
        Generates or enhances a professional job description, responsibilities, and qualifications.
        """
        raw_json = ""
        if GeminiService.is_available():
            prompt = (
                f"Generate a compelling, professional job posting for a {experience_required} {title}.\n"
                f"Key Skills Required: {skills_required}.\n"
                f"Current Draft: {current_description}\n\n"
                "Return strictly valid JSON with keys:\n"
                '  "description": "2-paragraph compelling job summary",\n'
                '  "responsibilities": "Bullet points of key duties",\n'
                '  "qualifications": "Bullet points of required experience & education",\n'
                '  "skills_required": "Comma-separated list of top required skills"\n'
            )
            raw_json = GeminiService.generate_career_guidance(prompt)

        if raw_json:
            try:
                clean_json = re.sub(r'^```json\s*|\s*```$', '', raw_json.strip(), flags=re.MULTILINE)
                parsed = json.loads(clean_json)
                if isinstance(parsed, dict) and "description" in parsed:
                    return parsed
            except Exception as e:
                print(f"[RecruiterAiService Warning] Failed to parse Gemini job description JSON: {e}")

        # Fallback Structured Job Generator
        skills_list = [s.strip() for s in skills_required.split(',') if s.strip()] if skills_required else ["React", "Python", "Django", "PostgreSQL", "REST APIs"]
        skills_str = ", ".join(skills_list)

        enhanced_desc = (
            f"We are seeking a talented and driven {title} ({experience_required} level) to join our innovative engineering team. "
            f"In this role, you will architect, build, and deploy high-performance web applications using modern technologies including {skills_str}. "
            f"You will collaborate closely with cross-functional product teams to deliver scalable software solutions serving global users."
        )

        responsibilities = (
            f"• Design, develop, and maintain responsive web applications and RESTful backend microservices.\n"
            f"• Collaborate with product managers and designers to translate business requirements into technical architectures.\n"
            f"• Optimize application performance, database query latency, and overall frontend user experience.\n"
            f"• Write clean, testable, and maintainable code adhering to industry software engineering best practices.\n"
            f"• Conduct code reviews and mentor junior engineering team members."
        )

        qualifications = (
            f"• Proven track record as a {title} with {experience_required} level experience.\n"
            f"• Strong proficiency in target technologies: {skills_str}.\n"
            f"• Bachelor's or Master's degree in Computer Science, Engineering, or equivalent practical experience.\n"
            f"• Excellent analytical problem-solving skills and effective team communication."
        )

        return {
            "description": enhanced_desc,
            "responsibilities": responsibilities,
            "qualifications": qualifications,
            "skills_required": skills_str
        }
