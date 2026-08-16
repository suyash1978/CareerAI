from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from apps.jobs.models import Resume
from .models import CareerAdviceSession, ResumeAnalysis, MockInterviewSession, MockInterviewQuestion, ChatConversation, ChatMessage
from .serializers import CareerAdviceSessionSerializer, ResumeAnalysisSerializer
from .services.skill_gap_analyzer import SkillGapAnalyzerService
from .services.resume_analyzer import ResumeAnalyzerService
from .services.mock_interview import MockInterviewService
from .services.chatbot import ChatbotService


class AiStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'status': 'active',
            'module': 'CareerAI Intelligence Assistant',
            'features': ['Resume Matching', 'Career Advice Chat', 'Skill Gap Analysis', 'AI Resume Analyzer', 'AI Mock Interview', 'CareerAI Assistant Chatbot']
        })


class CareerAdviceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        prompt = request.data.get('prompt', '')
        if not prompt:
            return Response({'error': 'Prompt string is required.'}, status=status.HTTP_400_BAD_REQUEST)

        ai_response = (
            f"Based on your query regarding '{prompt}', here is a recommended career step: "
            "Focus on highlighting your key projects, tailoring your resume for targeted keywords, "
            "and expanding your technical proficiency in high-demand domain frameworks."
        )

        session = CareerAdviceSession.objects.create(
            user=request.user,
            prompt=prompt,
            response=ai_response
        )

        return Response(CareerAdviceSessionSerializer(session).data, status=status.HTTP_201_CREATED)


class SkillGapAnalysisView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        job_id = request.data.get('job_id')
        target_role = request.data.get('target_role')
        target_skills = request.data.get('target_skills')

        analysis = SkillGapAnalyzerService.analyze_skill_gap(
            user=request.user,
            target_job_id=job_id,
            target_role_title=target_role,
            custom_skills=target_skills
        )

        return Response(analysis, status=status.HTTP_200_OK)


class ResumeAnalysisView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')
        
        if resume_id:
            try:
                resume = Resume.objects.get(id=resume_id, user=request.user)
            except Resume.DoesNotExist:
                return Response({'error': 'Resume not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)
        else:
            resume = Resume.objects.filter(user=request.user, is_primary=True).first()
            if not resume:
                resume = Resume.objects.filter(user=request.user).first()

        if not resume:
            return Response({
                'error': 'No uploaded resumes found. Please upload a PDF resume first.'
            }, status=status.HTTP_400_BAD_REQUEST)

        analysis_result = ResumeAnalyzerService.analyze_resume(resume)

        try:
            ResumeAnalysis.objects.create(
                user=request.user,
                resume_title=resume.title,
                extracted_skills=analysis_result['ai_suggestions'].get('skills_to_highlight', []),
                suggestions=analysis_result['ai_suggestions'].get('ats_compatibility_tips', []),
                match_score=analysis_result['resume_score']
            )
        except Exception as e:
            print(f"[ResumeAnalysisView Warning] Failed to log analysis record: {e}")

        return Response(analysis_result, status=status.HTTP_200_OK)


class MockInterviewStartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        target_role = request.data.get('target_role', 'Full-Stack Software Engineer')
        experience_level = request.data.get('experience_level', 'MID')
        technologies = request.data.get('technologies', '')
        job_id = request.data.get('job_id')

        session = MockInterviewService.start_session(
            user=request.user,
            target_role=target_role,
            experience_level=experience_level,
            technologies=technologies,
            job_id=job_id
        )

        questions = session.questions.all().order_by('question_number')
        questions_data = [
            {
                "id": q.id,
                "question_number": q.question_number,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "difficulty": q.difficulty,
            } for q in questions
        ]

        return Response({
            "session_id": session.id,
            "target_role": session.target_role,
            "experience_level": session.experience_level,
            "technologies": session.technologies,
            "status": session.status,
            "questions": questions_data
        }, status=status.HTTP_201_CREATED)


class MockInterviewSubmitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, session_id):
        try:
            session = MockInterviewSession.objects.get(id=session_id, user=request.user)
        except MockInterviewSession.DoesNotExist:
            return Response({'error': 'Interview session not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)

        answers_dict = request.data.get('answers', {})
        if not answers_dict:
            return Response({'error': 'Answers dictionary is required.'}, status=status.HTTP_400_BAD_REQUEST)

        evaluation = MockInterviewService.evaluate_session(session, answers_dict)
        return Response(evaluation, status=status.HTTP_200_OK)


class MockInterviewHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sessions = MockInterviewSession.objects.filter(user=request.user).order_by('-created_at')
        history = [
            {
                "id": s.id,
                "target_role": s.target_role,
                "experience_level": s.experience_level,
                "technologies": s.technologies,
                "status": s.status,
                "overall_score": s.overall_score,
                "created_at": s.created_at.strftime('%Y-%m-%d %H:%M')
            } for s in sessions
        ]
        return Response(history, status=status.HTTP_200_OK)


class MockInterviewDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, session_id):
        try:
            session = MockInterviewSession.objects.get(id=session_id, user=request.user)
        except MockInterviewSession.DoesNotExist:
            return Response({'error': 'Interview session not found or access denied.'}, status=status.HTTP_404_NOT_FOUND)

        questions = session.questions.all().order_by('question_number')
        questions_data = [
            {
                "id": q.id,
                "question_number": q.question_number,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "difficulty": q.difficulty,
                "user_answer": q.user_answer,
                "score": q.score,
                "strengths": q.strengths,
                "improvements": q.improvements,
                "ideal_answer": q.ideal_answer,
            } for q in questions
        ]

        return Response({
            "session_id": session.id,
            "target_role": session.target_role,
            "experience_level": session.experience_level,
            "technologies": session.technologies,
            "status": session.status,
            "overall_score": session.overall_score,
            "overall_feedback": session.overall_feedback,
            "questions": questions_data
        }, status=status.HTTP_200_OK)


class ChatConversationListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        conversations = ChatConversation.objects.filter(user=request.user).order_by('-updated_at')
        data = [
            {
                "id": c.id,
                "title": c.title,
                "created_at": c.created_at.strftime('%Y-%m-%d %H:%M'),
                "updated_at": c.updated_at.strftime('%Y-%m-%d %H:%M'),
            } for c in conversations
        ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        title = request.data.get('title', 'New Career Advice Chat')
        conversation = ChatConversation.objects.create(user=request.user, title=title)
        return Response({
            "id": conversation.id,
            "title": conversation.title,
            "created_at": conversation.created_at.strftime('%Y-%m-%d %H:%M'),
        }, status=status.HTTP_201_CREATED)


class ChatConversationDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            conversation = ChatConversation.objects.get(id=pk, user=request.user)
            conversation.delete()
            return Response({'message': 'Conversation deleted successfully.'}, status=status.HTTP_200_OK)
        except ChatConversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)


class ChatMessageListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            conversation = ChatConversation.objects.get(id=conversation_id, user=request.user)
        except ChatConversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        messages = conversation.messages.all().order_by('created_at')
        data = [
            {
                "id": m.id,
                "sender": m.sender,
                "text": m.text,
                "created_at": m.created_at.strftime('%H:%M'),
            } for m in messages
        ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, conversation_id):
        try:
            conversation = ChatConversation.objects.get(id=conversation_id, user=request.user)
        except ChatConversation.DoesNotExist:
            return Response({'error': 'Conversation not found.'}, status=status.HTTP_404_NOT_FOUND)

        text = request.data.get('text', '')
        if not text:
            return Response({'error': 'Message text is required.'}, status=status.HTTP_400_BAD_REQUEST)

        assistant_msg = ChatbotService.process_chat_message(request.user, conversation, text)

        messages = conversation.messages.all().order_by('created_at')
        data = [
            {
                "id": m.id,
                "sender": m.sender,
                "text": m.text,
                "created_at": m.created_at.strftime('%H:%M'),
            } for m in messages
        ]
        return Response(data, status=status.HTTP_200_OK)
