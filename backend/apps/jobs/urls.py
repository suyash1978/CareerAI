from rest_framework.routers import DefaultRouter
from .views import JobViewSet, JobApplicationViewSet, ResumeViewSet

router = DefaultRouter()
router.register(r'resumes', ResumeViewSet, basename='resume')
router.register(r'applications', JobApplicationViewSet, basename='job-application')
router.register(r'', JobViewSet, basename='job')

urlpatterns = router.urls
