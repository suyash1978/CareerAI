from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import JobSeekerProfile, RecruiterProfile
from .permissions import IsJobSeeker, IsRecruiter
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    CustomTokenObtainPairSerializer,
    LogoutSerializer,
    JobSeekerProfileSerializer,
    RecruiterProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    """Public endpoint to register new Job Seekers or Recruiters."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': f'Account created successfully as {user.get_role_display()}.'
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Public login endpoint returning JWT tokens and user role profile context."""
    serializer_class = CustomTokenObtainPairSerializer


class LogoutView(generics.GenericAPIView):
    """Protected endpoint to logout user by blacklisting the refresh token."""
    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Protected endpoint to view and update user profile & role-specific details."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        
        # Handle seeker profile update if user is JOB_SEEKER
        if user.is_job_seeker and hasattr(user, 'seeker_profile'):
            seeker_serializer = JobSeekerProfileSerializer(
                user.seeker_profile,
                data=request.data.get('seeker_profile', request.data),
                partial=True
            )
            if seeker_serializer.is_valid():
                seeker_serializer.save()

        # Handle recruiter profile update if user is RECRUITER
        elif user.is_recruiter and hasattr(user, 'recruiter_profile'):
            recruiter_serializer = RecruiterProfileSerializer(
                user.recruiter_profile,
                data=request.data.get('recruiter_profile', request.data),
                partial=True
            )
            if recruiter_serializer.is_valid():
                recruiter_serializer.save()

        return Response(UserProfileSerializer(user).data, status=status.HTTP_200_OK)
