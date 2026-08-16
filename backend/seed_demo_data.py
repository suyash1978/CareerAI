import os
import sys
import django

# Setup Django Environment
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import JobSeekerProfile, RecruiterProfile
from apps.jobs.models import Job, JobApplication

User = get_user_model()

def create_or_update_user(username, email, password, role, first_name="", last_name="", is_staff=False, is_superuser=False):
    user = User.objects.filter(username=username).first()
    if not user:
        user = User.objects.filter(email=email).first()
    if not user:
        user = User(username=username, email=email)
        
    user.username = username
    user.email = email
    user.role = role
    user.first_name = first_name
    user.last_name = last_name
    user.is_staff = is_staff
    user.is_superuser = is_superuser
    user.set_password(password)
    user.save()
    return user

def seed_data():
    print("[INFO] Seeding Demo Accounts and Sample Job Postings...")

    # 1. Job Seeker Demo Account ('seeker_demo')
    seeker_demo = create_or_update_user(
        username="seeker_demo",
        email="seeker_demo@careerai.com",
        password="Password123!",
        role=User.Role.JOB_SEEKER,
        first_name="Alex",
        last_name="Rivera"
    )
    sp_seeker, _ = JobSeekerProfile.objects.get_or_create(user=seeker_demo)
    sp_seeker.full_name = "Alex Rivera"
    sp_seeker.phone = "+1 (555) 345-6789"
    sp_seeker.location = "San Francisco, CA"
    sp_seeker.education = "B.S. Computer Science & Software Engineering"
    sp_seeker.skills = "React.js, Python, Django, Tailwind CSS, PostgreSQL, REST APIs, JavaScript"
    sp_seeker.experience = "Full-Stack Software Engineer with 3+ years experience building web architectures."
    sp_seeker.linkedin_url = "https://linkedin.com"
    sp_seeker.github_url = "https://github.com"
    sp_seeker.save()
    print("[SUCCESS] Created / updated demo seeker 'seeker_demo' (Password: Password123!)")

    # 2. Backward Compatibility Job Seeker ('Suyash')
    user_suyash = create_or_update_user(
        username="Suyash",
        email="suyash@example.com",
        password="Password123!",
        role=User.Role.JOB_SEEKER,
        first_name="Suyash",
        last_name="Mandekar"
    )
    sp_suyash, _ = JobSeekerProfile.objects.get_or_create(user=user_suyash)
    sp_suyash.full_name = "Suyash Mandekar"
    sp_suyash.phone = "+1 (555) 234-5678"
    sp_suyash.location = "San Francisco, CA"
    sp_suyash.education = "B.S. Computer Science & Artificial Intelligence"
    sp_suyash.skills = "React.js, Python, Django, Tailwind CSS, PostgreSQL, REST APIs"
    sp_suyash.experience = "Full-Stack Software Engineer with expertise in AI-driven web architectures."
    sp_suyash.save()
    print("[SUCCESS] Created / updated user 'Suyash' (Password: Password123!)")

    # 3. Recruiter Demo Account ('recruiter_demo')
    recruiter = create_or_update_user(
        username="recruiter_demo",
        email="recruiter_demo@careerai.com",
        password="Password123!",
        role=User.Role.RECRUITER,
        first_name="Sarah",
        last_name="Conner"
    )
    rp, _ = RecruiterProfile.objects.get_or_create(user=recruiter)
    rp.company_name = "CareerAI Tech Labs"
    rp.company_description = "Building next-generation AI platforms for talent acquisition and career automation."
    rp.company_website = "https://careerai.example.com"
    rp.company_location = "San Francisco, CA"
    rp.designation = "Lead Technical Recruiter"
    rp.save()
    print("[SUCCESS] Created / updated demo recruiter 'recruiter_demo' (Password: Password123!)")

    # 4. Admin Demo Account ('admin')
    admin = create_or_update_user(
        username="admin",
        email="admin@careerai.com",
        password="Password123!",
        role=User.Role.ADMIN,
        first_name="System",
        last_name="Admin",
        is_staff=True,
        is_superuser=True
    )
    print("[SUCCESS] Created / updated demo admin 'admin' (Password: Password123!)")

    # 5. Create sample jobs
    sample_jobs = [
        {
            "title": "Senior Full-Stack Engineer (React & Django)",
            "company": "CareerAI Tech Labs",
            "location": "San Francisco, CA (Hybrid)",
            "job_type": Job.JobType.FULL_TIME,
            "experience_required": Job.ExperienceLevel.SENIOR,
            "salary_min": 140000,
            "salary_max": 185000,
            "skills_required": "React.js, Python, Django, PostgreSQL, Tailwind CSS, REST APIs",
            "description": "Join our core engineering team building AI-driven career platforms. You will architect scalable REST APIs and modern React interfaces.",
            "responsibilities": "• Design and maintain Django REST APIs.\n• Build responsive React components with Tailwind CSS.\n• Optimize database queries and JWT security flows.",
            "qualifications": "• 5+ years full-stack development experience.\n• Proficiency in Django ORM and React Context/Hooks.\n• BS/MS in Computer Science or related field.",
            "status": Job.Status.ACTIVE
        },
        {
            "title": "AI & Machine Learning Specialist",
            "company": "CareerAI Tech Labs",
            "location": "Remote",
            "job_type": Job.JobType.REMOTE,
            "experience_required": Job.ExperienceLevel.MID,
            "salary_min": 130000,
            "salary_max": 170000,
            "skills_required": "Python, PyTorch, LLM, Natural Language Processing, FastAPI",
            "description": "Help design intelligent resume parsing, career path recommendations, and AI matching algorithms.",
            "responsibilities": "• Develop NLP models for resume skill extraction.\n• Fine-tune LLM prompts for automated career advice.\n• Integrate model inference into DRF microservices.",
            "qualifications": "• 3+ years hands-on ML & NLP engineering.\n• Experience deploying PyTorch / HuggingFace models in production.",
            "status": Job.Status.ACTIVE
        },
        {
            "title": "Frontend Developer (React & Vite)",
            "company": "Nexus Web Systems",
            "location": "New York, NY",
            "job_type": Job.JobType.FULL_TIME,
            "experience_required": Job.ExperienceLevel.MID,
            "salary_min": 115000,
            "salary_max": 145000,
            "skills_required": "React.js, Vite, Tailwind CSS, Axios, JavaScript (ES6+)",
            "description": "Create stunning, accessible user interfaces with dynamic animations and modern glassmorphic aesthetics.",
            "responsibilities": "• Build reusable UI component design systems.\n• Integrate client-side state with REST APIs.\n• Ensure high performance and cross-browser responsiveness.",
            "qualifications": "• 3+ years experience with React.js and modern CSS frameworks.\n• Strong mastery of HTML5, CSS3, and JavaScript.",
            "status": Job.Status.ACTIVE
        },
        {
            "title": "DevOps & Cloud Infrastructure Engineer",
            "company": "CloudScale Solutions",
            "location": "Austin, TX (Remote Available)",
            "job_type": Job.JobType.CONTRACT,
            "experience_required": Job.ExperienceLevel.SENIOR,
            "salary_min": 150000,
            "salary_max": 190000,
            "skills_required": "Docker, Kubernetes, AWS, PostgreSQL, CI/CD, Terraform",
            "description": "Manage multi-cloud infrastructure, automated deployment pipelines, and database replication.",
            "responsibilities": "• Maintain Kubernetes clusters and CI/CD pipelines.\n• Optimize PostgreSQL database connection pooling and failover.",
            "qualifications": "• 4+ years DevOps & AWS cloud infrastructure management.",
            "status": Job.Status.ACTIVE
        }
    ]

    created_jobs = []
    for jdata in sample_jobs:
        job, jcreated = Job.objects.get_or_create(
            title=jdata["title"],
            company=jdata["company"],
            recruiter=recruiter,
            defaults=jdata
        )
        created_jobs.append(job)
        if jcreated:
            print(f"[JOB] Created job: {job.title}")

    # Seed sample job application for candidate pipeline
    if created_jobs:
        JobApplication.objects.get_or_create(
            job=created_jobs[0],
            applicant=seeker_demo,
            defaults={
                "cover_letter": "I am excited to apply for the Senior Full-Stack Engineer role at CareerAI Tech Labs.",
                "status": JobApplication.Status.APPLIED
            }
        )

    print("\n[SUCCESS] Demo Data Seeding Completed Successfully!")

if __name__ == "__main__":
    seed_data()
