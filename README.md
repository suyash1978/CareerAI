# 🚀 CareerAI – AI-Powered Smart Job Portal & Career Assistant

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0%2B-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-3.4-blue.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**CareerAI** is an intelligent, full-stack career platform and recruitment system. It bridges job seekers and recruiters using deterministic algorithms, structured PDF resume parsing, real-time analytics, and Google Gemini AI assistance.

🚀 **Live Demo:** [View CareerAI](https://career-ai-psi-lemon.vercel.app/)

---

## 🌟 Key Features

### 👤 1. Authentication & Role-Based Access Control (RBAC)
- **Role Isolation**: Dedicated user experiences for `JOB_SEEKER`, `RECRUITER`, and `ADMIN`.
- **Secure JWT Auth**: Access & refresh tokens via SimpleJWT with blacklist revocation on logout.
- **Custom User Profiles**: Job seeker skills, education, and links vs recruiter company profiles.

### 💼 2. Job Management & Application Tracking
- **Multi-Filter Search**: Search jobs by keyword, location, job type, experience, skills, and salary range.
- **Recruiter Controls**: Post, edit, close/reopen, and manage candidate applications.
- **Candidate Pipeline**: Track application states (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW`, `HIRED`, `REJECTED`).
- **Duplicate Application Prevention**: Enforced database constraints (`unique_together`) prevent duplicate job applications.

### 📄 3. Resume Management & PDF Parsing
- **PDF Upload & Validation**: Secure file storage with file format & size validation (<=10MB).
- **Direct PDF Media Serving**: Configured backend media routes serving PDFs via `http://localhost:8000/media/...`.
- **Text & Entity Extraction**: Modular PDF parser extracting contact info, skills, education, experience, and projects.
- **Primary Resume Toggle**: Support for multiple resumes per candidate.

### 🎯 4. AI-Powered Job Matching Engine
- **Deterministic Match Scoring**: Transparent weighted scoring (Skills 50%, Experience 30%, Education 20%).
- **Score Rationale**: Detailed breakdown of matching skills, missing skills, and overall fit percentage.

### 📊 5. AI Career Skill Gap Analysis
- **Target Role Evaluation**: Compare current candidate profile & resume skills against desired target roles.
- **Visual Analytics**: Readiness score gauge (0-100%), skill comparison grid, and prioritized 3-phase learning roadmap.

### 🔍 6. AI Resume Analyzer
- **Empirical Audit**: Contact completeness check, core sections audit, action verbs counter, and overall ATS score (0-100).
- **AI Bullet Rewrites**: Concrete, metric-driven recommendations to improve resume impact and ATS compliance.

### 🎙️ 7. AI Mock Interview Simulator
- **Tailored Question Generator**: 5 custom questions (Technical, HR, Project-based) tailored to target role and technologies.
- **Live Answer Evaluation**: Scoring (0-100), key strengths, improvement areas, and ideal answer suggestions.

### 🤖 8. CareerAI Assistant Chatbot
- **Context-Aware Guidance**: Analyzes user profile, resume skills, active applications, and saved jobs.
- **Multi-Session Chat**: Conversation history, message streaming, quick prompt chips, and global floating widget.

### 🛠️ 9. AI Recruiter Suite
- **Candidate Ranking**: Deterministically ranks job applicants with rank badges (`#1 Candidate`) and sub-score breakdowns.
- **AI Qualification Summaries**: Concise 2-sentence background alignment summaries for recruiters.
- **Job Description Assistant**: AI tool to generate and enhance professional job postings, duties, and qualifications.

### 🛡️ 10. Admin Control Center & Analytics Suite
- **Platform Analytics**: Total users, active jobs, application funnel, top skills taxonomy, and active hiring companies.
- **User & Job Moderation**: Search/filter users, toggle active/blocked account status, and moderate suspicious job postings.

---

## 🏗️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide React Icons, Axios, React Router v6, ThemeContext |
| **Backend** | Python 3.10+, Django 5.0, Django REST Framework, SimpleJWT, Django CORS Headers |
| **AI & ML Services** | Google Gemini API (via backend proxy), `pypdf` PDF Parsing, Custom Deterministic Engines |
| **Database** | SQLite (Default Dev) / PostgreSQL Ready |

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### 1️⃣ Backend Setup (Django REST Framework)

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
# On Windows:
python -m venv venv
.\venv\Scripts\activate

# On macOS/Linux:
# python3 -m venv venv
# source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment configuration file
cp .env.example .env

# Edit .env and set your GEMINI_API_KEY:
# GEMINI_API_KEY=your_actual_gemini_api_key

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Seed sample demo data (jobs, users, applications)
python seed_demo_data.py

# Start Django development server (Port 8000)
python manage.py runserver 8000
```

---

### 2️⃣ Frontend Setup (React + Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Create environment configuration file
cp .env.example .env

# Start Vite development server (Port 5173)
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 🔐 Demo Credentials (Seeded)

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Job Seeker** | `seeker_demo` | `Password123!` | Recommended Jobs, Skill Gap, Resume Analyzer, Mock Interview, Chatbot |
| **Recruiter** | `recruiter_demo` | `Password123!` | Create/Edit Jobs, Candidate Ranking, Candidate Summaries, Job Enhancer |
| **Admin** | `admin` | `Password123!` | Platform Analytics, User Management, Job Post Moderation |

---

## 🛠️ Environment Variables Reference

### Backend (`backend/.env`)
```ini
SECRET_KEY=your-production-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (`frontend/.env`)
```ini
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## 🖼️ Application Visual Tour & Screenshots

*(Placeholders for application screenshots)*

### 1. Landing Page & Hero Section (Light & Dark Themes)
`[ Screenshot Placeholder: Landing Page with Glassmorphic Hero & Sun/Moon Theme Toggle ]`

### 2. Candidate Dashboard & Recommended Jobs
`[ Screenshot Placeholder: Recommended Jobs with Match Score Percentages & Skills Badges ]`

### 3. AI Skill Gap Analysis Dashboard
`[ Screenshot Placeholder: Readiness Score Gauge, Missing Skills Comparison, 3-Phase Roadmap ]`

### 4. AI Resume Analyzer & ATS Score
`[ Screenshot Placeholder: ATS Score Gauge, Section Audit, Metric-Driven Bullet Rewrites ]`

### 5. AI Mock Interview Simulator
`[ Screenshot Placeholder: Tailored Technical Questions Stepper & Answer Evaluation ]`

### 6. Recruiter Candidate Ranking & AI Summaries
`[ Screenshot Placeholder: Candidate Rank Badges (#1 Candidate), Score Breakdown, AI Summaries ]`

### 7. Platform Admin Analytics Control Center
`[ Screenshot Placeholder: Admin Stat Cards, Application Funnel, Top Skills, Active Companies ]`

---

## 📄 License & Disclaimer

This project is open-source under the MIT License.

> **Disclaimer**: *CareerAI match scores, ATS recommendations, candidate summaries, and interview evaluations are AI-assisted decision-support tools. They are designed for guidance and do not guarantee specific hiring outcomes or employment offers.*
