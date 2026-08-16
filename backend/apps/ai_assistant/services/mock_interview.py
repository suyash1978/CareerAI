import json
import re
from apps.jobs.models import Job, Resume
from apps.ai_assistant.models import MockInterviewSession, MockInterviewQuestion
from .gemini_service import GeminiService


class MockInterviewService:
    @staticmethod
    def start_session(user, target_role: str, experience_level: str = 'MID', technologies: str = '', job_id=None) -> MockInterviewSession:
        """
        Creates a new MockInterviewSession and populates 5 tailored interview questions.
        """
        # 1. Gather Candidate Context
        seeker_profile = getattr(user, 'seeker_profile', None)
        primary_resume = Resume.objects.filter(user=user, is_primary=True).first()

        cand_skills = ""
        if seeker_profile and seeker_profile.skills:
            cand_skills += seeker_profile.skills + ", "
        if primary_resume and primary_resume.skills:
            cand_skills += primary_resume.skills

        job_desc = ""
        if job_id:
            try:
                j = Job.objects.get(id=job_id)
                job_desc = f"{j.title} at {j.company}. Requirements: {j.skills_required}. {j.description}"
            except Job.DoesNotExist:
                pass

        # 2. Create Session Record
        session = MockInterviewSession.objects.create(
            user=user,
            target_role=target_role or "Full-Stack Software Engineer",
            experience_level=experience_level or "MID",
            technologies=technologies or cand_skills or "React, Python, Django, PostgreSQL",
            status=MockInterviewSession.Status.IN_PROGRESS
        )

        # 3. Generate Questions (via Gemini or Fallback Generator)
        questions_payload = MockInterviewService.generate_questions(
            target_role=session.target_role,
            experience_level=session.experience_level,
            technologies=session.technologies,
            cand_skills=cand_skills,
            job_desc=job_desc
        )

        # 4. Save Question Records
        for idx, q in enumerate(questions_payload, start=1):
            MockInterviewQuestion.objects.create(
                session=session,
                question_number=idx,
                question_text=q["text"],
                question_type=q["type"],
                difficulty=q["difficulty"]
            )

        return session

    @staticmethod
    def generate_questions(target_role: str, experience_level: str, technologies: str, cand_skills: str, job_desc: str) -> list:
        """
        Generates 5 questions (Technical, Project-based, HR) tailored to candidate skills & role.
        """
        raw_json = ""
        if GeminiService.is_available():
            prompt = (
                f"Generate 5 interview questions for a {experience_level} {target_role}.\n"
                f"Target Technologies: {technologies}.\n"
                f"Candidate Skills: {cand_skills}.\n"
                "Provide strictly valid JSON list with 5 objects containing keys: 'text', 'type', 'difficulty'.\n"
                "Where type is one of ['TECHNICAL', 'HR', 'PROJECT'] and difficulty is ['EASY', 'MEDIUM', 'HARD'].\n"
                "Include 2 Technical, 2 Project-based, and 1 HR question."
            )
            raw_json = GeminiService.generate_career_guidance(prompt)

        if raw_json:
            try:
                clean_json = re.sub(r'^```json\s*|\s*```$', '', raw_json.strip(), flags=re.MULTILINE)
                parsed = json.loads(clean_json)
                if isinstance(parsed, list) and len(parsed) >= 5:
                    return parsed[:5]
            except Exception as e:
                print(f"[MockInterviewService Warning] Failed to parse Gemini question JSON: {e}")

        # Fallback question matrix
        tech_list = [t.strip() for t in technologies.split(',') if t.strip()] if technologies else ["React", "Python", "Django", "REST API"]
        main_tech = tech_list[0] if tech_list else "Software Engineering"
        second_tech = tech_list[1] if len(tech_list) > 1 else "Database Design"

        return [
            {
                "text": f"Explain core performance optimization patterns when scaling {main_tech} applications.",
                "type": "TECHNICAL",
                "difficulty": "MEDIUM"
            },
            {
                "text": f"How do you design secure authentication, state persistence, and error handling in a {main_tech} and {second_tech} architecture?",
                "type": "TECHNICAL",
                "difficulty": "HARD" if experience_level in ['SENIOR', 'LEAD'] else "MEDIUM"
            },
            {
                "text": f"Describe a complex project where you used {main_tech}. What technical challenges did you encounter and how did you resolve them?",
                "type": "PROJECT",
                "difficulty": "MEDIUM"
            },
            {
                "text": f"Walk me through a scenario where a database query or API endpoint caused high latency. How did you diagnose and optimize it?",
                "type": "PROJECT",
                "difficulty": "HARD"
            },
            {
                "text": f"Tell me about a time you had a technical disagreement with a team member regarding system architecture or code review. How did you handle it?",
                "type": "HR",
                "difficulty": "EASY"
            }
        ]

    @staticmethod
    def evaluate_session(session: MockInterviewSession, answers_dict: dict) -> dict:
        """
        Evaluates candidate submitted answers, updates per-question scores, strengths,
        improvements, ideal answers, and overall session score.
        """
        questions = session.questions.all().order_by('question_number')
        total_score = 0
        evaluated_questions = []

        overall_strengths = []
        overall_improvements = []

        for q in questions:
            user_ans = answers_dict.get(str(q.id)) or answers_dict.get(q.id) or ""
            q.user_answer = user_ans

            eval_result = MockInterviewService.evaluate_single_answer(q, user_ans, session)

            q.score = eval_result["score"]
            q.strengths = eval_result["strengths"]
            q.improvements = eval_result["improvements"]
            q.ideal_answer = eval_result["ideal_answer"]
            q.save()

            total_score += q.score

            if eval_result["strengths"]:
                overall_strengths.extend(eval_result["strengths"][:1])
            if eval_result["improvements"]:
                overall_improvements.extend(eval_result["improvements"][:1])

            evaluated_questions.append({
                "id": q.id,
                "question_number": q.question_number,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "difficulty": q.difficulty,
                "user_answer": q.user_answer,
                "score": q.score,
                "strengths": q.strengths,
                "improvements": q.improvements,
                "ideal_answer": q.ideal_answer
            })

        avg_score = round(total_score / max(1, len(questions)))
        session.overall_score = avg_score
        session.status = MockInterviewSession.Status.COMPLETED
        session.overall_feedback = {
            "summary": f"Interview completed with an overall score of {avg_score}%. Excellent technical articulation.",
            "overall_strengths": overall_strengths[:3],
            "overall_improvements": overall_improvements[:3]
        }
        session.save()

        return {
            "session_id": session.id,
            "target_role": session.target_role,
            "overall_score": avg_score,
            "overall_feedback": session.overall_feedback,
            "questions": evaluated_questions
        }

    @staticmethod
    def evaluate_single_answer(q: MockInterviewQuestion, user_answer: str, session: MockInterviewSession) -> dict:
        """
        Evaluates a single answer, returning score, strengths, improvements, and ideal answer.
        """
        ans_clean = user_answer.strip()
        words = ans_clean.split()
        word_count = len(words)

        if not ans_clean:
            return {
                "score": 0,
                "strengths": ["None provided."],
                "improvements": ["No answer submitted. Provide a structured response using the STAR method (Situation, Task, Action, Result)."],
                "ideal_answer": f"To answer '{q.question_text}', structure your response with specific technical examples, key architecture decisions, and measurable outcomes."
            }

        raw_json = ""
        if GeminiService.is_available():
            prompt = (
                f"Evaluate candidate answer for {session.target_role} position.\n"
                f"Question: {q.question_text}\n"
                f"Candidate Answer: {ans_clean}\n\n"
                "Return valid JSON object with keys: 'score' (number 0-100), 'strengths' (list of strings), "
                "'improvements' (list of strings), 'ideal_answer' (string)."
            )
            raw_json = GeminiService.generate_career_guidance(prompt)

        if raw_json:
            try:
                clean_json = re.sub(r'^```json\s*|\s*```$', '', raw_json.strip(), flags=re.MULTILINE)
                parsed = json.loads(clean_json)
                if isinstance(parsed, dict) and "score" in parsed:
                    return {
                        "score": int(parsed.get("score", 75)),
                        "strengths": parsed.get("strengths", ["Demonstrated clear communication."]),
                        "improvements": parsed.get("improvements", ["Quantify metrics and scale."]),
                        "ideal_answer": parsed.get("ideal_answer", f"A strong answer explicitly covers key technical patterns and trade-offs.")
                    }
            except Exception as e:
                print(f"[MockInterviewService Warning] Failed to parse Gemini evaluation JSON: {e}")

        # Fallback Heuristic Evaluation
        base_score = 60
        strengths = []
        improvements = []

        if word_count >= 50:
            base_score += 20
            strengths.append("Comprehensive response with detailed technical context.")
        elif word_count >= 20:
            base_score += 10
            strengths.append("Clear and concise initial explanation.")
        else:
            improvements.append("Response is brief; expand with concrete project examples and technical depth.")

        # Key action verbs check
        if any(w.lower() in ans_clean.lower() for w in ['built', 'designed', 'optimized', 'implemented', 'handled', 'used', 'scaled']):
            base_score += 15
            strengths.append("Effective use of active engineering terminology.")

        final_score = min(100, max(0, base_score))

        if not strengths:
            strengths.append("Addressed the primary question prompt.")

        if not improvements:
            improvements.append("Consider adding specific quantitative metrics (e.g. 'reduced latency by 40%').")

        ideal_answer_text = (
            f"An outstanding response to '{q.question_text}' starts by defining core concepts, "
            f"details your technical approach using {session.technologies or 'relevant frameworks'}, "
            f"and concludes with measurable business or performance results."
        )

        return {
            "score": final_score,
            "strengths": strengths,
            "improvements": improvements,
            "ideal_answer": ideal_answer_text
        }
