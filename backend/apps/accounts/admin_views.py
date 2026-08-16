from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from django.db.models import Count, Q
from apps.accounts.permissions import IsAdmin
from apps.accounts.models import JobSeekerProfile, RecruiterProfile
from apps.jobs.models import Job, JobApplication

User = get_user_model()


class AdminAnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        # 1. User Metrics
        total_users = User.objects.count()
        total_seekers = User.objects.filter(role=User.Role.JOB_SEEKER).count()
        total_recruiters = User.objects.filter(role=User.Role.RECRUITER).count()
        total_admins = User.objects.filter(Q(role=User.Role.ADMIN) | Q(is_staff=True)).count()

        # 2. Job Metrics
        total_jobs = Job.objects.count()
        active_jobs = Job.objects.filter(status=Job.Status.ACTIVE).count()
        closed_jobs = Job.objects.filter(status=Job.Status.CLOSED).count()

        # 3. Application Metrics & Status Funnel
        total_apps = JobApplication.objects.count()
        apps_by_status = {
            'APPLIED': JobApplication.objects.filter(status=JobApplication.Status.APPLIED).count(),
            'UNDER_REVIEW': JobApplication.objects.filter(status=JobApplication.Status.UNDER_REVIEW).count(),
            'SHORTLISTED': JobApplication.objects.filter(status=JobApplication.Status.SHORTLISTED).count(),
            'INTERVIEW': JobApplication.objects.filter(status=JobApplication.Status.INTERVIEW).count(),
            'HIRED': JobApplication.objects.filter(status=JobApplication.Status.HIRED).count(),
            'REJECTED': JobApplication.objects.filter(status=JobApplication.Status.REJECTED).count(),
        }

        # 4. Top Skills Taxonomy (from profile skills & job requirements)
        skills_counter = {}
        for s_prof in JobSeekerProfile.objects.exclude(skills=''):
            if s_prof.skills:
                for s in s_prof.skills.split(','):
                    clean = s.strip()
                    if clean:
                        skills_counter[clean] = skills_counter.get(clean, 0) + 1

        for job in Job.objects.exclude(skills_required=''):
            if job.skills_required:
                for s in job.skills_required.split(','):
                    clean = s.strip()
                    if clean:
                        skills_counter[clean] = skills_counter.get(clean, 0) + 1

        sorted_skills = sorted(
            [{"skill": k, "count": v} for k, v in skills_counter.items()],
            key=lambda x: x["count"],
            reverse=True
        )[:8]

        # 5. Most Active Companies
        companies = Job.objects.values('company').annotate(job_count=Count('id')).order_by('-job_count')[:6]
        active_companies = [{"company": c["company"], "count": c["job_count"]} for c in companies]

        # 6. Recent Registrations (Last 10 users)
        recent_users = User.objects.all().order_by('-date_joined')[:10]
        recent_registrations = [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active,
                "date_joined": u.date_joined.strftime('%Y-%m-%d %H:%M')
            } for u in recent_users
        ]

        return Response({
            "users": {
                "total": total_users,
                "seekers": total_seekers,
                "recruiters": total_recruiters,
                "admins": total_admins
            },
            "jobs": {
                "total": total_jobs,
                "active": active_jobs,
                "closed": closed_jobs
            },
            "applications": {
                "total": total_apps,
                "by_status": apps_by_status
            },
            "top_skills": sorted_skills,
            "active_companies": active_companies,
            "recent_registrations": recent_registrations
        }, status=status.HTTP_200_OK)


class AdminUserManagementView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        role_filter = request.query_params.get('role')
        search_query = request.query_params.get('search')

        qs = User.objects.all().order_by('-date_joined')

        if role_filter:
            qs = qs.filter(role=role_filter)

        if search_query:
            qs = qs.filter(Q(username__icontains=search_query) | Q(email__icontains=search_query))

        data = [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "role": u.role,
                "is_active": u.is_active,
                "date_joined": u.date_joined.strftime('%Y-%m-%d %H:%M')
            } for u in qs
        ]
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request):
        user_id = request.data.get('user_id')
        is_active = request.data.get('is_active')

        if user_id is None or is_active is None:
            return Response({'error': 'user_id and is_active parameters are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target_user = User.objects.get(id=user_id)
            target_user.is_active = bool(is_active)
            target_user.save()
            return Response({
                'message': f"User '{target_user.username}' active status updated to {target_user.is_active}.",
                'user_id': target_user.id,
                'is_active': target_user.is_active
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


class AdminJobModerationView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        status_filter = request.query_params.get('status')
        qs = Job.objects.all().order_by('-created_at')

        if status_filter:
            qs = qs.filter(status=status_filter)

        data = [
            {
                "id": j.id,
                "title": j.title,
                "company": j.company,
                "location": j.location,
                "recruiter_email": j.recruiter.email,
                "status": j.status,
                "applications_count": j.applications.count(),
                "created_at": j.created_at.strftime('%Y-%m-%d %H:%M')
            } for j in qs
        ]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, pk):
        try:
            job = Job.objects.get(id=pk)
        except Job.DoesNotExist:
            return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

        action_type = request.data.get('action') # 'MODERATE' | 'APPROVE' | 'DELETE'

        if action_type == 'DELETE':
            job.delete()
            return Response({'message': 'Job posting deleted permanently.'}, status=status.HTTP_200_OK)
        elif action_type == 'MODERATE':
            job.status = Job.Status.CLOSED
            job.save()
            return Response({'message': 'Job posting moderated and closed.', 'status': job.status}, status=status.HTTP_200_OK)
        elif action_type == 'APPROVE':
            job.status = Job.Status.ACTIVE
            job.save()
            return Response({'message': 'Job posting approved and set to active.', 'status': job.status}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid action type.'}, status=status.HTTP_400_BAD_REQUEST)


class AdminApplicationListView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        applications = JobApplication.objects.all().order_by('-applied_at')
        data = [
            {
                "id": app.id,
                "job_id": app.job.id,
                "job_title": app.job.title,
                "company": app.job.company,
                "applicant_name": app.applicant.username,
                "applicant_email": app.applicant.email,
                "status": app.status,
                "applied_at": app.applied_at.strftime('%Y-%m-%d %H:%M')
            } for app in applications
        ]
        return Response(data, status=status.HTTP_200_OK)
