from rest_framework import serializers
from apps.accounts.serializers import JobSeekerProfileSerializer
from .models import Job, JobApplication, SavedJob, Resume


class JobSerializer(serializers.ModelSerializer):
    recruiter_username = serializers.ReadOnlyField(source='recruiter.username')
    applications_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = (
            'id', 'title', 'company', 'location', 'job_type',
            'experience_required', 'salary_min', 'salary_max',
            'skills_required', 'description', 'responsibilities',
            'qualifications', 'deadline', 'status', 'recruiter',
            'recruiter_username', 'applications_count', 'is_saved',
            'has_applied', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'recruiter', 'created_at', 'updated_at')

    def get_applications_count(self, obj):
        return obj.applications.count()

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return JobApplication.objects.filter(applicant=request.user, job=obj).exists()
        return False

    def validate(self, attrs):
        salary_min = attrs.get('salary_min')
        salary_max = attrs.get('salary_max')
        if salary_min is not None and salary_max is not None and salary_min > salary_max:
            raise serializers.ValidationError({"salary_min": "Minimum salary cannot be greater than maximum salary."})
        return attrs


class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_username = serializers.ReadOnlyField(source='applicant.username')
    applicant_email = serializers.ReadOnlyField(source='applicant.email')
    applicant_full_name = serializers.SerializerMethodField()
    applicant_profile = serializers.SerializerMethodField()
    job_title = serializers.ReadOnlyField(source='job.title')
    job_company = serializers.ReadOnlyField(source='job.company')
    job_location = serializers.ReadOnlyField(source='job.location')

    class Meta:
        model = JobApplication
        fields = (
            'id', 'job', 'job_title', 'job_company', 'job_location',
            'applicant', 'applicant_username', 'applicant_email',
            'applicant_full_name', 'applicant_profile', 'resume',
            'cover_letter', 'recruiter_notes', 'status', 'applied_at'
        )
        read_only_fields = ('id', 'applicant', 'applied_at')

    def get_applicant_full_name(self, obj):
        if hasattr(obj.applicant, 'seeker_profile') and obj.applicant.seeker_profile.full_name:
            return obj.applicant.seeker_profile.full_name
        return f"{obj.applicant.first_name} {obj.applicant.last_name}".strip() or obj.applicant.username

    def get_applicant_profile(self, obj):
        if hasattr(obj.applicant, 'seeker_profile'):
            return JobSeekerProfileSerializer(obj.applicant.seeker_profile).data
        return None

    def validate(self, attrs):
        request = self.context.get('request')
        job = attrs.get('job')
        if request and request.user.is_authenticated and job:
            if self.instance is None and JobApplication.objects.filter(job=job, applicant=request.user).exists():
                raise serializers.ValidationError({"job": "You have already applied for this position."})
        return attrs


class SavedJobSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)

    class Meta:
        model = SavedJob
        fields = ('id', 'user', 'job', 'job_details', 'saved_at')
        read_only_fields = ('id', 'user', 'saved_at')


class ResumeSerializer(serializers.ModelSerializer):
    user_username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Resume
        fields = (
            'id', 'user', 'user_username', 'title', 'file', 'is_primary',
            'raw_text', 'name', 'email', 'phone', 'skills',
            'education', 'experience', 'projects', 'parsed_data',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'user', 'raw_text', 'created_at', 'updated_at')

    def validate_file(self, file_obj):
        # 1. Validate extension
        filename = file_obj.name.lower()
        if not filename.endswith('.pdf'):
            raise serializers.ValidationError("Only PDF resume files (.pdf) are supported.")

        # 2. Validate file size (max 10MB)
        MAX_SIZE = 10 * 1024 * 1024 # 10MB
        if file_obj.size > MAX_SIZE:
            raise serializers.ValidationError("Resume file size cannot exceed 10MB.")

        return file_obj
