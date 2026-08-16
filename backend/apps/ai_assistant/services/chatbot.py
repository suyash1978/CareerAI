from apps.ai_assistant.models import ChatConversation, ChatMessage
from .user_context import UserContextService
from .gemini_service import GeminiService

DISCLAIMER_FOOTER = "\n\n*Note: CareerAI suggestions are intended as career development guidance and do not guarantee specific hiring outcomes or employment offers.*"


class ChatbotService:
    @staticmethod
    def process_chat_message(user, conversation: ChatConversation, user_text: str) -> ChatMessage:
        """
        Processes a user message, fetches context, queries Gemini AI, and returns the Assistant response message.
        """
        clean_text = user_text.strip()

        # 1. Save User Message
        user_msg = ChatMessage.objects.create(
            conversation=conversation,
            sender=ChatMessage.Sender.USER,
            text=clean_text
        )

        # Update Conversation Title if default
        if conversation.title == 'Career Advice Session' and len(conversation.messages.all()) <= 2:
            short_title = clean_text[:35] + ('...' if len(clean_text) > 35 else '')
            conversation.title = short_title
            conversation.save()

        # 2. Extract Candidate Context
        ctx = UserContextService.get_user_context(user)
        system_prompt = UserContextService.format_context_prompt(ctx)

        # 3. Assemble Message History Context (Last 6 messages)
        recent_messages = conversation.messages.all().order_by('-created_at')[:6]
        history_str = ""
        for m in reversed(recent_messages):
            history_str += f"{m.sender}: {m.text}\n"

        full_prompt = (
            f"{system_prompt}\n\n"
            f"Recent Conversation History:\n{history_str}\n"
            f"USER: {clean_text}\n"
            f"ASSISTANT:"
        )

        # 4. Query Gemini API or Fallback Generator
        ai_reply = ""
        if GeminiService.is_available():
            ai_reply = GeminiService.generate_career_guidance(full_prompt)

        if not ai_reply:
            ai_reply = ChatbotService._generate_fallback_response(clean_text, ctx)

        # Attach Disclaimer
        if DISCLAIMER_FOOTER.strip() not in ai_reply:
            ai_reply += DISCLAIMER_FOOTER

        # 5. Save Assistant Message
        assistant_msg = ChatMessage.objects.create(
            conversation=conversation,
            sender=ChatMessage.Sender.ASSISTANT,
            text=ai_reply,
            context_used={
                "skills_count": len(ctx["skills"]),
                "has_resume": ctx["has_resume"],
                "applications_count": len(ctx["recent_applications"])
            }
        )

        return assistant_msg

    @staticmethod
    def _generate_fallback_response(user_text: str, ctx: dict) -> str:
        """
        Fallback conversational engine when Gemini API is unconfigured.
        """
        text_lower = user_text.lower()

        if any(kw in text_lower for kw in ['resume', 'cv', 'profile']):
            skills_txt = ", ".join(ctx["skills"][:4]) if ctx["skills"] else "technical skills"
            return (
                f"Based on your profile, your key skills include **{skills_txt}**.\n\n"
                "To optimize your resume for target positions:\n"
                "• Structure experience using the **Action Verb + Task + Quantifiable Result** formula.\n"
                "• Highlight major technical projects demonstrating end-to-end framework integration.\n"
                "• Ensure your contact details and skills section are clearly formatted at the top."
            )

        if any(kw in text_lower for kw in ['interview', 'question', 'prep', 'prepare']):
            return (
                "Here are core interview preparation steps for technical roles:\n"
                "1. **STAR Method**: Practice answering behavioral questions using Situation, Task, Action, and Result.\n"
                "2. **System Design & Architecture**: Be ready to explain how you scale backend APIs and optimize database query latency.\n"
                "3. **Mock Interviews**: Practice articulating your project challenges and trade-offs out loud."
            )

        if any(kw in text_lower for kw in ['skill', 'learn', 'gap']):
            return (
                "To maximize your career readiness:\n"
                "• Focus on high-demand skills like **React.js, Django, Docker, PostgreSQL, and REST API design**.\n"
                "• Build production-grade capstone projects demonstrating containerization and CI/CD deployment.\n"
                "• Check out the **Skill Gap Analysis** tool in CareerAI to view a personalized 3-phase learning roadmap!"
            )

        name = ctx["full_name"] or ctx["username"]
        return (
            f"Hello {name}! I am your **CareerAI Assistant**.\n\n"
            "I can help you with:\n"
            "• **Resume Optimization & ATS Tips**\n"
            "• **Interview Question Practice & STAR Method Preparation**\n"
            "• **Skill Gap Analysis & Learning Roadmaps**\n"
            "• **Job Search & Application Strategies**\n\n"
            "Feel free to ask any question about your job applications or target career role!"
        )
