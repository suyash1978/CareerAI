from django.contrib import admin
from .models import CareerAdviceSession, ResumeAnalysis


@admin.register(CareerAdviceSession)
class CareerAdviceSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'prompt', 'created_at')
    search_fields = ('user__username', 'prompt', 'response')


@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ('user', 'resume_title', 'match_score', 'created_at')
    search_fields = ('user__username', 'resume_title')
