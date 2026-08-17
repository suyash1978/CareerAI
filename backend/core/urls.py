from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.response import Response
from rest_framework.decorators import api_view
from apps.accounts.admin_views import (
    AdminAnalyticsView, AdminUserManagementView, AdminJobModerationView, AdminApplicationListView
)

@api_view(['GET'])
def health_check(request):
    """Health check endpoint to verify backend status and database connectivity."""
    db_status = 'connected'
    db_ok = True
    tables = []
    user_count = -1
    job_count = -1
    db_error = None
    try:
        from django.db import connection
        from django.contrib.auth import get_user_model
        from apps.jobs.models import Job
        
        tables = connection.introspection.table_names()
        User = get_user_model()
        user_count = User.objects.count()
        job_count = Job.objects.count()
    except Exception as e:
        import traceback
        db_ok = False
        db_error = f"{type(e).__name__}: {str(e)}\n{traceback.format_exc()}"

    return Response({
        'status': 'healthy' if db_ok else 'degraded',
        'database': db_status,
        'db_error': db_error,
        'tables_found': tables,
        'user_count': user_count,
        'job_count': job_count,
        'app': 'CareerAI Backend API',
        'version': '1.0.0'
    }, status=200 if db_ok else 500)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/health/', health_check, name='health-check'),
    path('api/v1/accounts/', include('apps.accounts.urls')),
    path('api/v1/jobs/', include('apps.jobs.urls')),
    path('api/v1/ai/', include('apps.ai_assistant.urls')),

    # Admin Platform Routes
    path('api/v1/admin/analytics/', AdminAnalyticsView.as_view(), name='admin-analytics'),
    path('api/v1/admin/users/', AdminUserManagementView.as_view(), name='admin-users'),
    path('api/v1/admin/jobs/', AdminJobModerationView.as_view(), name='admin-jobs'),
    path('api/v1/admin/jobs/<int:pk>/moderate/', AdminJobModerationView.as_view(), name='admin-job-moderate'),
    path('api/v1/admin/applications/', AdminApplicationListView.as_view(), name='admin-applications'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
