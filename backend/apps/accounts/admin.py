from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, JobSeekerProfile, RecruiterProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff', 'created_at')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('CareerAI Role Information', {
            'fields': ('role',),
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('CareerAI Role Information', {
            'fields': ('role',),
        }),
    )


@admin.register(JobSeekerProfile)
class JobSeekerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'phone', 'location', 'updated_at')
    search_fields = ('user__username', 'full_name', 'email', 'skills')


@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company_name', 'designation', 'company_location', 'updated_at')
    search_fields = ('user__username', 'company_name', 'designation')
