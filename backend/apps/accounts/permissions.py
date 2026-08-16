from rest_framework import permissions


class IsJobSeeker(permissions.BasePermission):
    """Custom permission to allow access only to Job Seekers."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'JOB_SEEKER'
        )


class IsRecruiter(permissions.BasePermission):
    """Custom permission to allow access only to Recruiters."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.role == 'RECRUITER'
        )


class IsAdmin(permissions.BasePermission):
    """Custom permission to allow access only to Admins."""

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'ADMIN' or request.user.is_staff)
        )
