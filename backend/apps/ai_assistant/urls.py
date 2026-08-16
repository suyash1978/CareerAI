from django.urls import path
from .views import (
    AiStatusView, CareerAdviceView, SkillGapAnalysisView, ResumeAnalysisView,
    MockInterviewStartView, MockInterviewSubmitView, MockInterviewHistoryView, MockInterviewDetailView,
    ChatConversationListCreateView, ChatConversationDetailView, ChatMessageListCreateView
)

urlpatterns = [
    path('status/', AiStatusView.as_view(), name='ai-status'),
    path('advice/', CareerAdviceView.as_view(), name='ai-advice'),
    path('skill-gap-analysis/', SkillGapAnalysisView.as_view(), name='skill-gap-analysis'),
    path('resume-analysis/', ResumeAnalysisView.as_view(), name='resume-analysis'),
    path('interview/start/', MockInterviewStartView.as_view(), name='mock-interview-start'),
    path('interview/<int:session_id>/submit/', MockInterviewSubmitView.as_view(), name='mock-interview-submit'),
    path('interview/history/', MockInterviewHistoryView.as_view(), name='mock-interview-history'),
    path('interview/<int:session_id>/', MockInterviewDetailView.as_view(), name='mock-interview-detail'),
    path('conversations/', ChatConversationListCreateView.as_view(), name='chat-conversations-list-create'),
    path('conversations/<int:pk>/', ChatConversationDetailView.as_view(), name='chat-conversation-detail'),
    path('conversations/<int:conversation_id>/messages/', ChatMessageListCreateView.as_view(), name='chat-messages-list-create'),
]
