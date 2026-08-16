import re
from apps.jobs.models import Job, Resume
from .gemini_service import GeminiService

# Preset Standard Career Roles Matrix
PRESET_ROLES = {
    "Full-Stack Engineer": {
        "title": "Full-Stack Engineer",
        "skills": ["React.js", "Python", "Django", "PostgreSQL", "REST API", "Tailwind CSS", "Docker", "Git"],
        "description": "Architects modern responsive frontend UIs and scalable backend web microservices."
    },
    "AI/ML Specialist": {
        "title": "AI/ML Specialist",
        "skills": ["Python", "PyTorch", "TensorFlow", "Pandas", "LLM", "NLP", "FastAPI", "Scikit-Learn"],
        "description": "Develops machine learning models, fine-tunes LLMs, and builds automated AI pipelines."
    },
    "DevOps & Cloud Specialist": {
        "title": "DevOps & Cloud Specialist",
        "skills": ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux", "PostgreSQL", "Python"],
        "description": "Manages automated CI/CD pipelines, multi-cloud deployment, and Kubernetes clusters."
    },
    "Backend Python Architect": {
        "title": "Backend Python Architect",
        "skills": ["Python", "Django", "PostgreSQL", "Redis", "REST API", "Docker", "Celery", "Microservices"],
        "description": "Engineers high-throughput backend services, database query optimizations, and REST APIs."
    },
    "Frontend React Specialist": {
        "title": "Frontend React Specialist",
        "skills": ["React.js", "JavaScript", "TypeScript", "Vite", "Tailwind CSS", "HTML5", "CSS3", "Redux"],
        "description": "Crafts high-performance, accessible web interfaces and complex client-side applications."
    }
}


class SkillGapAnalyzerService:
    @staticmethod
    def analyze_skill_gap(user, target_job_id=None, target_role_title=None, custom_skills=None) -> dict:
        """
        Performs skill gap analysis comparing candidate skills vs target job or role requirements.
        """
        # 1. Candidate Skills Collection
        seeker_profile = getattr(user, 'seeker_profile', None)
        primary_resume = Resume.objects.filter(user=user, is_primary=True).first()

        cand_skills_list = []
        if seeker_profile and seeker_profile.skills:
            for s in seeker_profile.skills.split(','):
                if s.strip():
                    cand_skills_list.append(s.strip())

        if primary_resume and primary_resume.skills:
            for s in primary_resume.skills.split(','):
                if s.strip():
                    cand_skills_list.append(s.strip())

        cand_skills_normalized = {s.lower(): s for s in cand_skills_list}

        # 2. Target Job / Role Resolution
        target_title = "Selected Target Role"
        target_skills_list = []

        if target_job_id:
            try:
                job = Job.objects.get(id=target_job_id)
                target_title = f"{job.title} at {job.company}"
                if job.skills_required:
                    target_skills_list = [s.strip() for s in job.skills_required.split(',') if s.strip()]
            except Job.DoesNotExist:
                pass

        if not target_skills_list and target_role_title:
            role_info = PRESET_ROLES.get(target_role_title)
            if role_info:
                target_title = role_info["title"]
                target_skills_list = role_info["skills"]
            else:
                target_title = target_role_title

        if not target_skills_list and custom_skills:
            target_skills_list = [s.strip() for s in custom_skills.split(',') if s.strip()]

        if not target_skills_list:
            # Default fallback to Full-Stack Engineer
            default_role = PRESET_ROLES["Full-Stack Engineer"]
            target_title = default_role["title"]
            target_skills_list = default_role["skills"]

        # 3. Compute Acquired vs Missing Skills
        acquired_skills = []
        missing_skills = []

        for req in target_skills_list:
            req_lower = req.lower()
            is_acquired = any(cs in req_lower or req_lower in cs for cs in cand_skills_normalized.keys())
            if is_acquired:
                acquired_skills.append(req)
            else:
                missing_skills.append(req)

        total_target = len(target_skills_list)
        readiness_score = round((len(acquired_skills) / max(1, total_target)) * 100)

        # 4. Generate Priority List
        priority_list = []
        for idx, skill in enumerate(missing_skills):
            if idx < 2:
                priority = "HIGH"
                timeframe = "1-2 Weeks"
                reason = f"Essential core requirement for {target_title} positions."
            elif idx < 5:
                priority = "MEDIUM"
                timeframe = "3-4 Weeks"
                reason = "Highly recommended for competitive proficiency."
            else:
                priority = "LOW"
                timeframe = "5-6 Weeks"
                reason = "Nice-to-have bonus technical competency."

            priority_list.append({
                "skill": skill,
                "priority": priority,
                "timeframe": timeframe,
                "reason": reason
            })

        # 5. Generate 3-Phase Beginner to Advanced Learning Roadmap
        roadmap = SkillGapAnalyzerService.generate_roadmap(missing_skills, target_title)

        # 6. Generate Recommendations & Optional Gemini AI Rationale
        recommendations = [
            f"Focus on mastering high-priority missing skills: {', '.join(missing_skills[:2]) if missing_skills else 'All core skills acquired!'}.",
            "Build real-world portfolio projects incorporating missing target technologies.",
            "Update your profile skills & upload a refreshed PDF resume after completing projects."
        ]

        ai_guidance = ""
        if GeminiService.is_available():
            prompt = (
                f"Candidate wants to become a {target_title}.\n"
                f"Current Skills: {', '.join(acquired_skills)}.\n"
                f"Missing Skills: {', '.join(missing_skills)}.\n"
                "Provide a concise 3-bullet point career advice roadmap for this developer."
            )
            ai_guidance = GeminiService.generate_career_guidance(prompt)

        return {
            "target_title": target_title,
            "readiness_score": readiness_score,
            "acquired_skills": acquired_skills,
            "missing_skills": missing_skills,
            "total_target_skills": total_target,
            "priority_list": priority_list,
            "roadmap": roadmap,
            "recommendations": recommendations,
            "ai_guidance": ai_guidance,
            "preset_roles": list(PRESET_ROLES.keys())
        }

    @staticmethod
    def generate_roadmap(missing_skills: list, target_title: str) -> list:
        """
        Generates a 3-phase beginner-to-advanced learning roadmap.
        """
        focus_skills = missing_skills if missing_skills else ["Advanced System Architecture", "Production CI/CD", "Security Hardening"]

        phase_1_skills = focus_skills[:2]
        phase_2_skills = focus_skills[2:4] if len(focus_skills) > 2 else [focus_skills[0]]
        phase_3_skills = focus_skills[4:] if len(focus_skills) > 4 else focus_skills

        return [
            {
                "phase": "Phase 1: Foundational Competencies",
                "weeks": "Weeks 1 - 3",
                "level": "Beginner to Intermediate",
                "focus_skills": phase_1_skills,
                "action_items": [
                    f"Study official documentation and core concepts for {', '.join(phase_1_skills)}.",
                    "Build small standalone scripts or single-page demo components.",
                    "Complete interactive exercises and tutorials."
                ],
                "milestone": f"Demonstrate working knowledge of {phase_1_skills[0] if phase_1_skills else 'core concepts'}."
            },
            {
                "phase": "Phase 2: Integration & Advanced Patterns",
                "weeks": "Weeks 4 - 7",
                "level": "Intermediate",
                "focus_skills": phase_2_skills,
                "action_items": [
                    f"Integrate {', '.join(phase_2_skills)} into existing full-stack applications.",
                    "Implement state management, API security, and database ORM optimization.",
                    "Write unit tests and automated integration test coverage."
                ],
                "milestone": "Successfully integrate backend APIs and frontend components with clean error handling."
            },
            {
                "phase": "Phase 3: Production Capstone Project",
                "weeks": "Weeks 8 - 12",
                "level": "Advanced",
                "focus_skills": phase_3_skills,
                "action_items": [
                    f"Architect a production-grade full-stack project demonstrating {', '.join(focus_skills[:3])}.",
                    "Containerize application using Docker and set up automated CI/CD pipelines.",
                    "Publish project on GitHub and feature live demo link on resume."
                ],
                "milestone": f"Publish portfolio project ready to showcase in {target_title} interviews."
            }
        ]
