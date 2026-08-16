from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from apps.accounts.permissions import IsRecruiter, IsJobSeeker
from .models import Job, JobApplication, SavedJob, Resume
from .serializers import JobSerializer, JobApplicationSerializer, SavedJobSerializer, ResumeSerializer
from .services.resume_parser import ResumeParserService
from .services.job_matcher import JobMatcherService
from .services.recruiter_ai import RecruiterAiService


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'company', 'description', 'location', 'skills_required']
    ordering_fields = ['created_at', 'salary_min', 'title']

    def get_queryset(self):
        queryset = Job.objects.all().order_by('-created_at')

        # For detail actions or recruiter management, return all jobs regardless of status
        if self.action in ['retrieve', 'update', 'partial_update', 'destroy', 'toggle_status', 'applicants', 'ranked_applicants', 'save_job', 'match_details']:
            return queryset

        status_param = self.request.query_params.get('status')
        my_jobs_param = self.request.query_params.get('my_jobs')

        if my_jobs_param and self.request.user.is_authenticated:
            queryset = queryset.filter(recruiter=self.request.user)
            if status_param:
                queryset = queryset.filter(status=status_param)
        else:
            if status_param:
                queryset = queryset.filter(status=status_param)
            else:
                queryset = queryset.filter(status=Job.Status.ACTIVE)

        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)

        job_type = self.request.query_params.get('job_type')
        if job_type:
            queryset = queryset.filter(job_type=job_type)

        experience = self.request.query_params.get('experience')
        if experience:
            queryset = queryset.filter(experience_required=experience)

        skills = self.request.query_params.get('skills')
        if skills:
            queryset = queryset.filter(skills_required__icontains=skills)

        min_salary = self.request.query_params.get('min_salary')
        if min_salary:
            try:
                min_sal_val = float(min_salary)
                queryset = queryset.filter(Q(salary_min__gte=min_sal_val) | Q(salary_max__gte=min_sal_val))
            except ValueError:
                pass

        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'toggle_status', 'my_jobs', 'applicants', 'ranked_applicants', 'generate_description']:
            return [permissions.IsAuthenticated(), IsRecruiter()]
        elif self.action in ['recommendations']:
            return [permissions.IsAuthenticated(), IsJobSeeker()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsJobSeeker])
    def recommendations(self, request):
        """Returns AI Recommended jobs for current job seeker, ordered by match score descending."""
        active_jobs = Job.objects.filter(status=Job.Status.ACTIVE)
        matched_jobs = []

        for job in active_jobs:
            match_data = JobMatcherService.calculate_match(job, request.user)
            job_serialized = self.get_serializer(job, context={'request': request}).data
            job_serialized['match_details'] = match_data
            matched_jobs.append(job_serialized)

        matched_jobs.sort(key=lambda x: x['match_details']['match_score'], reverse=True)

        page = self.paginate_queryset(matched_jobs)
        if page is not None:
            return self.get_paginated_response(page)

        return Response(matched_jobs)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def match_details(self, request, pk=None):
        """Returns detailed match score breakdown for a specific job against current user."""
        job = self.get_object()
        match_data = JobMatcherService.calculate_match(job, request.user)
        return Response(match_data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsRecruiter])
    def my_jobs(self, request):
        """Returns jobs posted by current recruiter."""
        jobs = Job.objects.filter(recruiter=request.user).order_by('-created_at')
        page = self.paginate_queryset(jobs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsRecruiter])
    def toggle_status(self, request, pk=None):
        """Toggle status between ACTIVE and CLOSED."""
        job = self.get_object()
        if job.recruiter != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

        if job.status == Job.Status.ACTIVE:
            job.status = Job.Status.CLOSED
        else:
            job.status = Job.Status.ACTIVE

        job.save()
        return Response({
            'status': job.status,
            'message': f'Job status updated to {job.get_status_display()}.',
            'job': self.get_serializer(job).data
        })

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def save_job(self, request, pk=None):
        """Save/bookmark or unsave a job for the current user."""
        job = self.get_object()
        saved_instance, created = SavedJob.objects.get_or_create(user=request.user, job=job)

        if not created:
            saved_instance.delete()
            return Response({'saved': False, 'message': 'Job removed from saved items.'})

        return Response({'saved': True, 'message': 'Job saved successfully.'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def saved(self, request):
        """Get all saved jobs for current user."""
        saved_jobs = SavedJob.objects.filter(user=request.user).order_by('-saved_at')
        page = self.paginate_queryset(saved_jobs)
        if page is not None:
            serializer = SavedJobSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        serializer = SavedJobSerializer(saved_jobs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsRecruiter])
    def applicants(self, request, pk=None):
        """Get applicants for a specific job posted by the recruiter."""
        job = self.get_object()
        if job.recruiter != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

        applications = job.applications.all().order_by('-applied_at')
        serializer = JobApplicationSerializer(applications, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsRecruiter])
    def ranked_applicants(self, request, pk=None):
        """
        Ranks all applicants for a specific job using transparent match scoring criteria,
        candidate qualification summaries, and assistive disclaimers.
        """
        job = self.get_object()
        if job.recruiter != request.user:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)

        ranked_data = RecruiterAiService.rank_applicants(job, request.user)
        return Response(ranked_data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsRecruiter])
    def generate_description(self, request):
        """
        Generates or enhances a professional job description, responsibilities, and qualifications.
        """
        title = request.data.get('title', 'Software Engineer')
        skills_required = request.data.get('skills_required', '')
        experience_required = request.data.get('experience_required', 'MID')
        current_description = request.data.get('current_description', '')

        result = RecruiterAiService.generate_or_enhance_job_description(
            title=title,
            skills_required=skills_required,
            experience_required=experience_required,
            current_description=current_description
        )

        return Response(result, status=status.HTTP_200_OK)


class JobApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = JobApplicationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsJobSeeker()]
        elif self.action in ['update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsRecruiter()]
        elif self.action == 'destroy':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'role') and user.role == 'RECRUITER':
            return JobApplication.objects.filter(job__recruiter=user).order_by('-applied_at')
        return JobApplication.objects.filter(applicant=user).order_by('-applied_at')

    def perform_create(self, serializer):
        serializer.save(applicant=self.request.user)

    def destroy(self, request, *args, **kwargs):
        application = self.get_object()
        if application.applicant != request.user:
            return Response({'detail': 'You can only withdraw your own applications.'}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(application)
        return Response({'message': 'Application withdrawn successfully.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def stats(self, request):
        """Get statistics summary of applications for dashboard widgets."""
        user = request.user
        if hasattr(user, 'role') and user.role == 'RECRUITER':
            qs = JobApplication.objects.filter(job__recruiter=user)
        else:
            qs = JobApplication.objects.filter(applicant=user)

        total = qs.count()
        applied = qs.filter(status=JobApplication.Status.APPLIED).count()
        under_review = qs.filter(status=JobApplication.Status.UNDER_REVIEW).count()
        shortlisted = qs.filter(status=JobApplication.Status.SHORTLISTED).count()
        interview = qs.filter(status=JobApplication.Status.INTERVIEW).count()
        hired = qs.filter(status=JobApplication.Status.HIRED).count()
        rejected = qs.filter(status=JobApplication.Status.REJECTED).count()

        return Response({
            'total': total,
            'applied': applied,
            'under_review': under_review,
            'shortlisted': shortlisted,
            'interview': interview,
            'hired': hired,
            'rejected': rejected,
        })


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        has_primary = Resume.objects.filter(user=self.request.user, is_primary=True).exists()
        is_primary = not has_primary

        resume = serializer.save(user=self.request.user, is_primary=is_primary)

        try:
            raw_text = ResumeParserService.extract_text_from_pdf(resume.file)
            parsed_info = ResumeParserService.parse_resume_text(raw_text)

            resume.raw_text = raw_text
            resume.name = parsed_info.get("name", "")
            resume.email = parsed_info.get("email", "")
            resume.phone = parsed_info.get("phone", "")
            resume.skills = parsed_info.get("skills", "")
            resume.education = parsed_info.get("education", "")
            resume.experience = parsed_info.get("experience", "")
            resume.projects = parsed_info.get("projects", "")
            resume.parsed_data = parsed_info.get("parsed_data", {})
            resume.save()
        except Exception as e:
            print(f"[ResumeViewSet Error] Failed to parse resume PDF: {e}")

    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        """Set target resume as primary."""
        resume = self.get_object()
        Resume.objects.filter(user=request.user, is_primary=True).update(is_primary=False)
        resume.is_primary = True
        resume.save()
        return Response({'message': 'Primary resume updated successfully.', 'resume': self.get_serializer(resume).data})

    @action(detail=True, methods=['post'])
    def parse(self, request, pk=None):
        """Trigger parsing on an existing resume record."""
        resume = self.get_object()
        raw_text = ResumeParserService.extract_text_from_pdf(resume.file)
        parsed_info = ResumeParserService.parse_resume_text(raw_text)

        resume.raw_text = raw_text
        resume.name = parsed_info.get("name", "")
        resume.email = parsed_info.get("email", "")
        resume.phone = parsed_info.get("phone", "")
        resume.skills = parsed_info.get("skills", "")
        resume.education = parsed_info.get("education", "")
        resume.experience = parsed_info.get("experience", "")
        resume.projects = parsed_info.get("projects", "")
        resume.parsed_data = parsed_info.get("parsed_data", {})
        resume.save()

        return Response({
            'message': 'Resume parsed successfully.',
            'resume': self.get_serializer(resume).data
        })
