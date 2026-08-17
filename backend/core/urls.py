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
    db_ok = True
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
    except Exception:
        db_ok = False

    return Response({
        'status': 'healthy' if db_ok else 'degraded',
        'database': 'connected' if db_ok else 'disconnected',
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
