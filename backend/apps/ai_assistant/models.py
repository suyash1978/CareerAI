from django.db import models
from django.conf import settings


class CareerAdviceSession(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='ai_advice_sessions'
    )
    prompt = models.TextField()
    response = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Advice for {self.user.username} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class ResumeAnalysis(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='resume_analyses'
    )
    resume_title = models.CharField(max_length=255, default='My Resume')
    extracted_skills = models.JSONField(default=list, blank=True)
    suggestions = models.JSONField(default=list, blank=True)
    match_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resume Analysis for {self.user.username} ({self.match_score}%)"


class MockInterviewSession(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='mock_interview_sessions'
    )
    target_role = models.CharField(max_length=255)
    experience_level = models.CharField(max_length=50, default='MID')
    technologies = models.CharField(max_length=500, blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_PROGRESS)
    overall_score = models.IntegerField(default=0)
    overall_feedback = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Mock Interview ({self.target_role}) - {self.user.username} [{self.get_status_display()}]"


class MockInterviewQuestion(models.Model):
    class QuestionType(models.TextChoices):
        TECHNICAL = 'TECHNICAL', 'Technical'
        HR = 'HR', 'HR & Behavioral'
        PROJECT = 'PROJECT', 'Project-Based'

    class Difficulty(models.TextChoices):
        EASY = 'EASY', 'Easy'
        MEDIUM = 'MEDIUM', 'Medium'
        HARD = 'HARD', 'Hard'

    session = models.ForeignKey(
        MockInterviewSession,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    question_number = models.IntegerField(default=1)
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QuestionType.choices, default=QuestionType.TECHNICAL)
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    
    user_answer = models.TextField(blank=True, default='')
    score = models.IntegerField(default=0)
    strengths = models.JSONField(default=list, blank=True)
    improvements = models.JSONField(default=list, blank=True)
    ideal_answer = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['question_number']

    def __str__(self):
        return f"Q{self.question_number} ({self.get_question_type_display()}): {self.question_text[:50]}"


class ChatConversation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_conversations'
    )
    title = models.CharField(max_length=255, default='Career Advice Session')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"Chat '{self.title}' - {self.user.username}"


class ChatMessage(models.Model):
    class Sender(models.TextChoices):
        USER = 'USER', 'User'
        ASSISTANT = 'ASSISTANT', 'CareerAI Assistant'

    conversation = models.ForeignKey(
        ChatConversation,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.CharField(max_length=20, choices=Sender.choices, default=Sender.USER)
    text = models.TextField()
    context_used = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.sender}] {self.text[:40]}"
