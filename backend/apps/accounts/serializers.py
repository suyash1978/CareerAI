from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import JobSeekerProfile, RecruiterProfile

User = get_user_model()


class JobSeekerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobSeekerProfile
        fields = (
            'id', 'full_name', 'phone', 'location', 'education',
            'skills', 'experience', 'linkedin_url', 'github_url', 'updated_at'
        )
        read_only_fields = ('id', 'updated_at')


class RecruiterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterProfile
        fields = (
            'id', 'company_name', 'company_description', 'company_website',
            'company_location', 'designation', 'updated_at'
        )
        read_only_fields = ('id', 'updated_at')


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    # Optional profile fields during registration
    full_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    phone = serializers.CharField(write_only=True, required=False, allow_blank=True)
    company_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    designation = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'password_confirm',
            'role', 'full_name', 'phone', 'company_name', 'designation'
        )

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "User with this email already exists."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        full_name = validated_data.pop('full_name', '')
        phone = validated_data.pop('phone', '')
        company_name = validated_data.pop('company_name', '')
        designation = validated_data.pop('designation', '')

        # Create user using Django's secure password hashing
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', User.Role.JOB_SEEKER)
        )

        # Populate profile details based on role
        if user.role == User.Role.JOB_SEEKER and hasattr(user, 'seeker_profile'):
            profile = user.seeker_profile
            if full_name:
                profile.full_name = full_name
            if phone:
                profile.phone = phone
            profile.save()
        elif user.role == User.Role.RECRUITER and hasattr(user, 'recruiter_profile'):
            profile = user.recruiter_profile
            if company_name:
                profile.company_name = company_name
            if designation:
                profile.designation = designation
            profile.save()

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    seeker_profile = JobSeekerProfileSerializer(read_only=True)
    recruiter_profile = RecruiterProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'created_at', 'seeker_profile', 'recruiter_profile')
        read_only_fields = ('id', 'username', 'email', 'role', 'created_at')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        seeker_data = None
        recruiter_data = None
        if hasattr(self.user, 'seeker_profile'):
            seeker_data = JobSeekerProfileSerializer(self.user.seeker_profile).data
        if hasattr(self.user, 'recruiter_profile'):
            recruiter_data = RecruiterProfileSerializer(self.user.recruiter_profile).data

        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'seeker_profile': seeker_data,
            'recruiter_profile': recruiter_data,
        }
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError:
            raise serializers.ValidationError({"refresh": "Invalid or expired refresh token."})
