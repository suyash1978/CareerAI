from rest_framework import serializers
from .models import CareerAdviceSession, ResumeAnalysis


class CareerAdviceSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerAdviceSession
        fields = ('id', 'user', 'prompt', 'response', 'created_at')
        read_only_fields = ('id', 'user', 'response', 'created_at')


class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = ('id', 'user', 'resume_title', 'extracted_skills', 'suggestions', 'match_score', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')
