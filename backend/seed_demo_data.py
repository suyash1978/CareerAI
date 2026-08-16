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
from apps.jobs.models import Job

User = get_user_model()

def seed_data():
    print("[INFO] Seeding Demo Accounts and Sample Job Postings...")

    # 1. Create or update user 'Suyash'
    user_suyash, created = User.objects.get_or_create(
        username="Suyash",
        defaults={
            "email": "suyash@example.com",
            "role": User.Role.JOB_SEEKER,
            "first_name": "Suyash",
            "last_name": "Mandekar"
        }
    )
    user_suyash.set_password("Password123!")
    user_suyash.save()

    if hasattr(user_suyash, 'seeker_profile'):
        sp = user_suyash.seeker_profile
        sp.full_name = "Suyash Mandekar"
        sp.phone = "+1 (555) 234-5678"
        sp.location = "San Francisco, CA"
        sp.education = "B.S. Computer Science & Artificial Intelligence"
        sp.skills = "React.js, Python, Django, Tailwind CSS, PostgreSQL, REST APIs"
        sp.experience = "Full-Stack Software Engineer with expertise in AI-driven web architectures."
        sp.linkedin_url = "https://linkedin.com"
        sp.github_url = "https://github.com"
        sp.save()

    print("[SUCCESS] Created / updated user 'Suyash' (Password: Password123!)")

    # 2. Create demo Recruiter user
    recruiter, _ = User.objects.get_or_create(
        username="recruiter_demo",
        defaults={
            "email": "recruiter@careerai.com",
            "role": User.Role.RECRUITER,
            "first_name": "Sarah",
            "last_name": "Conner"
        }
    )
    recruiter.set_password("Password123!")
    recruiter.save()

    if hasattr(recruiter, 'recruiter_profile'):
        rp = recruiter.recruiter_profile
        rp.company_name = "CareerAI Tech Labs"
        rp.company_description = "Building next-generation AI platforms for talent acquisition and career automation."
        rp.company_website = "https://careerai.example.com"
        rp.company_location = "San Francisco, CA"
        rp.designation = "Lead Technical Recruiter"
        rp.save()

    print("[SUCCESS] Created demo recruiter 'recruiter_demo' (Password: Password123!)")

    # 3. Create sample jobs
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

    for jdata in sample_jobs:
        job, jcreated = Job.objects.get_or_create(
            title=jdata["title"],
            company=jdata["company"],
            recruiter=recruiter,
            defaults=jdata
        )
        if jcreated:
            print(f"[JOB] Created job: {job.title}")

    print("\n[SUCCESS] Demo Data Seeding Completed Successfully!")

if __name__ == "__main__":
    seed_data()
