from apps.jobs.models import JobApplication, SavedJob, Resume


class UserContextService:
    @staticmethod
    def get_user_context(user) -> dict:
        """
        Extracts candidate's profile details, primary PDF resume information,
        recent applications, and saved jobs to inject into Chatbot system prompts.
        """
        seeker_profile = getattr(user, 'seeker_profile', None)
        primary_resume = Resume.objects.filter(user=user, is_primary=True).first()

        # Profile & Resume Skills
        profile_skills = seeker_profile.skills if seeker_profile else ""
        resume_skills = primary_resume.skills if primary_resume else ""
        
        combined_skills = set()
        if profile_skills:
            for s in profile_skills.split(','):
                if s.strip(): combined_skills.add(s.strip())
        if resume_skills:
            for s in resume_skills.split(','):
                if s.strip(): combined_skills.add(s.strip())

        # Education & Experience
        education = (seeker_profile.education if seeker_profile else "") or (primary_resume.education if primary_resume else "")
        experience = (seeker_profile.experience if seeker_profile else "") or (primary_resume.experience if primary_resume else "")

        # Applications context
        recent_apps = JobApplication.objects.filter(applicant=user).order_by('-applied_at')[:5]
        apps_list = [f"{app.job.title} at {app.job.company} [{app.get_status_display()}]" for app in recent_apps]

        # Saved jobs context
        saved_jobs = SavedJob.objects.filter(user=user).order_by('-saved_at')[:5]
        saved_list = [f"{sj.job.title} at {sj.job.company}" for sj in saved_jobs]

        full_name = getattr(seeker_profile, 'full_name', '') or user.username

        return {
            "username": user.username,
            "full_name": full_name,
            "role": getattr(user, 'role', 'JOB_SEEKER'),
            "skills": list(combined_skills),
            "education": education,
            "experience": experience,
            "has_resume": primary_resume is not None,
            "recent_applications": apps_list,
            "saved_jobs": saved_list
        }

    @staticmethod
    def format_context_prompt(ctx: dict) -> str:
        """
        Formats structured system prompt giving the AI Chatbot context on candidate.
        """
        skills_str = ", ".join(ctx["skills"]) if ctx["skills"] else "None specified"
        apps_str = "; ".join(ctx["recent_applications"]) if ctx["recent_applications"] else "None"
        saved_str = "; ".join(ctx["saved_jobs"]) if ctx["saved_jobs"] else "None"

        return (
            f"You are CareerAI Assistant, an expert AI career advisor.\n"
            f"Candidate Context:\n"
            f"- Name: {ctx['full_name']} ({ctx['username']})\n"
            f"- Skills: {skills_str}\n"
            f"- Education: {ctx['education'] or 'Not provided'}\n"
            f"- Work Experience Summary: {ctx['experience'] or 'Not provided'}\n"
            f"- Has Uploaded PDF Resume: {'Yes' if ctx['has_resume'] else 'No'}\n"
            f"- Recent Job Applications: {apps_str}\n"
            f"- Bookmarked Saved Jobs: {saved_str}\n\n"
            "Instructions:\n"
            "1. Provide actionable, supportive, professional advice on career guidance, resume improvements, job search strategy, skill gap development, and interview preparation.\n"
            "2. Reference candidate's skills, applied roles, or resume when relevant.\n"
            "3. Keep answers concise, clear, and well-structured using markdown lists or bullet points.\n"
            "4. Remind the user that AI suggestions are career development guidance and do not guarantee specific hiring outcomes."
        )
