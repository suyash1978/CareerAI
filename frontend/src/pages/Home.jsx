import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Briefcase, Bot, ShieldCheck, ArrowRight, TrendingUp,
  Target, Zap, FileText, MessageSquare, CheckCircle2, UserCheck, Search, Award
} from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20 py-6 transition-colors duration-200">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto px-4 sm:px-6">

          {/* Left Column: Hero Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>AI-Powered Career Intelligence Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Accelerate Your Career With{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                Precision AI Intelligence
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Find target tech opportunities, audit your resume against ATS algorithms, analyze skill gaps, and practice mock interviews with real-time AI feedback.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
              <Link
                to="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
              >
                <span>Explore Tech Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/ai-assistant"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-semibold px-7 py-3.5 rounded-xl shadow-sm transition-all"
              >
                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Try AI Assistant</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
              <div>
                <span className="block text-xl font-extrabold text-slate-900 dark:text-white">98%</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">ATS Match Accuracy</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-slate-900 dark:text-white">2.5x</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Faster Interview Prep</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-slate-900 dark:text-white">Instant</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">Skill Gap Feedback</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pure CSS SaaS UI Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl"></div>
            
            <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
              
              {/* Card Header Mockup */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Senior React & AI Engineer</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">CareerAI Match Intelligence</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-extrabold">
                  94% Match
                </span>
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Detected Skills</span>
                <div className="flex flex-wrap gap-1.5">
                  {['React.js', 'Python', 'Django REST', 'Tailwind CSS', 'PostgreSQL', 'AI Prompting'].map((skill, idx) => (
                    <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-1.5">
                <div className="flex items-center space-x-1.5 font-bold text-indigo-700 dark:text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Career Advice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-indigo-800/90 dark:text-indigo-300/90">
                  "Your background in Django REST APIs and React makes you a strong candidate. Add 1-2 examples of Docker containerization to maximize match score."
                </p>
              </div>

              {/* Quick Action Button */}
              <div className="pt-1">
                <div className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-xs font-semibold">
                  <span>Quick Apply & Resume Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid (5 Core Capabilities) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Comprehensive AI Career Suite
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Everything you need to discover roles, optimize application materials, and ace interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Job Matching</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Algorithmic recommendations evaluating your skills, experience, and preferred locations to connect you with active postings.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Resume Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Get instant ATS compatibility scores, structural breakdown, missing keyword highlights, and improvement suggestions.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Skill Gap Analysis</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Identify missing technical proficiencies for your target designation and receive tailored learning pathways.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="p-3 w-fit rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Mock Interviews</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Practice role-specific technical and behavioral interview questions with structured AI scoring and model answers.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3 lg:col-span-2">
            <div className="p-3 w-fit rounded-xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Context-Aware AI Assistant</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              An interactive 24/7 career mentor that understands your profile history, answers strategy questions, and drafts tailored job descriptions.
            </p>
          </div>

        </div>
      </section>

      {/* How CareerAI Works (3-Step Process) */}
      <section className="bg-slate-100/70 dark:bg-slate-900/40 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800/80 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How CareerAI Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
            Three simple steps to unlock your full professional potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 relative">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center">
              01
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Build Your Profile</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Create your account as a Job Seeker or Recruiter, upload your resume, and set your technical skill benchmarks.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 relative">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
              02
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Get AI Insights</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Receive AI match scores, instant resume optimization recommendations, and personalized skill gap analysis.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 relative">
            <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center">
              03
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Grow Your Career</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Apply to matched positions with confidence, practice mock interviews, and land your dream tech role.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative rounded-3xl bg-blue-600 dark:bg-blue-700 text-white p-8 sm:p-12 overflow-hidden shadow-xl text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Upgrade Your Job Search?
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Join thousands of job seekers and recruiters using AI to automate hiring and career advancement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-3 rounded-xl shadow-md transition-all"
          >
            Create Free Account
          </Link>
          <Link
            to="/jobs"
            className="w-full sm:w-auto bg-blue-700/60 hover:bg-blue-800 text-white border border-blue-400/40 font-semibold px-8 py-3 rounded-xl transition-all"
          >
            Browse Open Jobs
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
