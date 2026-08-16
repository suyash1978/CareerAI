import re
from apps.jobs.models import Job, Resume


class JobMatcherService:
    @staticmethod
    def get_candidate_data(user) -> dict:
        """
        Extracts combined candidate skills, education, and experience text
        from JobSeekerProfile and Primary Resume.
        """
        seeker_profile = getattr(user, 'seeker_profile', None)
        primary_resume = Resume.objects.filter(user=user, is_primary=True).first()

        skills_list = []
        
        # 1. Profile Skills
        if seeker_profile and seeker_profile.skills:
            for s in seeker_profile.skills.split(','):
                if s.strip():
                    skills_list.append(s.strip().lower())

        # 2. Resume Skills
        if primary_resume and primary_resume.skills:
            for s in primary_resume.skills.split(','):
                if s.strip():
                    skills_list.append(s.strip().lower())

        # Unique skills (normalized)
        unique_skills = set(skills_list)

        # Education text
        edu_text = ""
        if seeker_profile and seeker_profile.education:
            edu_text += " " + seeker_profile.education
        if primary_resume and primary_resume.education:
            edu_text += " " + primary_resume.education

        # Experience text
        exp_text = ""
        if seeker_profile and seeker_profile.experience:
            exp_text += " " + seeker_profile.experience
        if primary_resume and primary_resume.experience:
            exp_text += " " + primary_resume.experience

        return {
            "skills": unique_skills,
            "education": edu_text.strip(),
            "experience": exp_text.strip(),
            "has_resume": primary_resume is not None,
        }

    @staticmethod
    def calculate_match(job: Job, user) -> dict:
        """
        Calculates a transparent, deterministic match score (0 to 100) between a job and candidate.
        Returns match percentage, matching skills, missing skills, sub-scores, and AI explanation.
        """
        cand_data = JobMatcherService.get_candidate_data(user)
        cand_skills = cand_data["skills"]

        # 1. Skills Matching (Max 50 points)
        req_skills_raw = [s.strip() for s in job.skills_required.split(',') if s.strip()] if job.skills_required else []
        
        matching_skills = []
        missing_skills = []

        if not req_skills_raw:
            skills_score = 50
        else:
            for req in req_skills_raw:
                req_norm = req.lower()
                # Direct or substring match check
                matched = any(cand_s in req_norm or req_norm in cand_s for cand_s in cand_skills)
                if matched:
                    matching_skills.append(req)
                else:
                    missing_skills.append(req)

            match_ratio = len(matching_skills) / len(req_skills_raw)
            skills_score = round(match_ratio * 50)

        # 2. Experience Matching (Max 30 points)
        job_exp = job.experience_required
        exp_text_lower = cand_data["experience"].lower()

        # Deduce candidate experience level
        if any(kw in exp_text_lower for kw in ['senior', 'lead', 'architect', 'principal', '5+ years', '6+ years', '7+ years']):
            cand_exp_level = 'SENIOR'
        elif any(kw in exp_text_lower for kw in ['mid', '2+ years', '3+ years', '4+ years']):
            cand_exp_level = 'MID'
        else:
            cand_exp_level = 'ENTRY'

        LEVEL_RANK = {'ENTRY': 1, 'MID': 2, 'SENIOR': 3, 'LEAD': 4}
        job_rank = LEVEL_RANK.get(job_exp, 2)
        cand_rank = LEVEL_RANK.get(cand_exp_level, 2)

        if cand_rank >= job_rank:
            exp_score = 30
            exp_status = "Fully Met"
        elif cand_rank == job_rank - 1:
            exp_score = 20
            exp_status = "Partially Met (1 level below target)"
        else:
            exp_score = 10
            exp_status = "Gap Identified (Requires additional experience)"

        # 3. Education & Context Matching (Max 20 points)
        edu_text_lower = cand_data["education"].lower()
        job_qual_lower = (job.qualifications + " " + job.description).lower()

        edu_keywords = ['bachelor', 'master', 'b.s.', 'm.s.', 'computer science', 'engineering', 'degree', 'degree in cs']
        found_keywords = [kw for kw in edu_keywords if kw in edu_text_lower]

        if len(found_keywords) >= 2 or any(kw in edu_text_lower for kw in ['b.s.', 'm.s.', 'computer science']):
            edu_score = 20
            edu_status = "Strong Qualification Alignment"
        elif len(found_keywords) == 1:
            edu_score = 15
            edu_status = "Moderate Qualification Alignment"
        elif cand_data["education"]:
            edu_score = 10
            edu_status = "General Degree Listed"
        else:
            edu_score = 5
            edu_status = "Unspecified in Profile"

        # 4. Total Match Score Calculation
        overall_score = min(100, max(0, skills_score + exp_score + edu_score))

        # Match Grade Label
        if overall_score >= 85:
            match_label = "Excellent Match"
        elif overall_score >= 70:
            match_label = "Strong Match"
        elif overall_score >= 55:
            match_label = "Good Match"
        else:
            match_label = "Potential Match"

        # 5. Generate Explanation Rationale
        explanation = JobMatcherService.generate_match_explanation(
            overall_score=overall_score,
            matching_skills=matching_skills,
            missing_skills=missing_skills,
            exp_status=exp_status,
            edu_status=edu_status,
            job_title=job.title,
            company=job.company
        )

        return {
            "match_score": overall_score,
            "match_label": match_label,
            "sub_scores": {
                "skills_score": skills_score,
                "skills_max": 50,
                "experience_score": exp_score,
                "experience_max": 30,
                "education_score": edu_score,
                "education_max": 20,
            },
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "experience_match": exp_status,
            "education_match": edu_status,
            "explanation": explanation,
        }

    @staticmethod
    def generate_match_explanation(
        overall_score: int,
        matching_skills: list,
        missing_skills: list,
        exp_status: str,
        edu_status: str,
        job_title: str,
        company: str
    ) -> dict:
        """
        Generates structured, human-readable rationale and actionable skill improvement suggestions.
        Can be augmented or replaced by Gemini AI API in future modules.
        """
        strengths = []
        if matching_skills:
            strengths.append(f"Strong overlap in core required skills: {', '.join(matching_skills[:4])}.")
        if "Fully Met" in exp_status:
            strengths.append(f"Your background meets or exceeds the required seniority level for {job_title}.")
        if "Strong" in edu_status:
            strengths.append("Your educational background closely aligns with the job requirements.")

        gaps = []
        if missing_skills:
            gaps.append(f"Missing recommended technical skills: {', '.join(missing_skills[:4])}.")
        if "Partially" in exp_status or "Gap" in exp_status:
            gaps.append("Experience level is slightly below the preferred target seniority.")

        recommendations = []
        if missing_skills:
            recommendations.append(f"Adding competency in {missing_skills[0]} could increase your match score by +15%.")
        if not matching_skills:
            recommendations.append("Consider updating your profile skills or uploading a detailed PDF resume.")
        recommendations.append("Tailor your cover letter to highlight projects matching this role's key requirements.")

        summary_text = (
            f"Your profile scored {overall_score}% for the {job_title} position at {company}. "
            f"You possess {len(matching_skills)} of the {len(matching_skills) + len(missing_skills)} target skills requested."
        )

        return {
            "summary": summary_text,
            "strengths": strengths if strengths else ["Profile matches basic criteria."],
            "gaps": gaps if gaps else ["No major skill gaps identified."],
            "recommendations": recommendations,
        }
