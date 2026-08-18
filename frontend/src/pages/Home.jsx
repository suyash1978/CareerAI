import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, Bot, ShieldCheck, ArrowRight, TrendingUp, CheckCircle, Zap, Target, Award, Users, HeartHandshake } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20 py-4">

      {/* HospiWise Screenshot 1 Inspired Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 px-4">

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>24/7 AI Career Assistance Available</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Accelerate Your <br />
              <span className="text-blue-600">Career Growth</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Optimizing candidate matches for modern tech hiring. Discover tailored career opportunities, audit your resume in real time, and gain AI interview insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                to="/jobs"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                <span>Explore Top Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ai-assistant"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white border border-blue-200 hover:bg-blue-50/80 text-blue-600 font-bold px-7 py-3.5 rounded-xl shadow-xs transition-all"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Get Started →</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>AI-Powered Smart Job Matching</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Real-Time Resume Intelligence</span>
              </div>
            </div>
          </div>

          {/* Right Visual Card Showcase (Inspired by HospiWise asymmetric rounded cards) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-blue-500/20 transform hover:-translate-y-1 transition-all">
                <Target className="w-10 h-10 mb-3 text-blue-200" />
                <h4 className="font-extrabold text-lg">98% Match</h4>
                <p className="text-xs text-blue-100 mt-1">Algorithmic Skill Compatibility Engine</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-2">
                <Zap className="w-8 h-8 text-amber-500" />
                <h4 className="font-bold text-sm text-slate-900">Skill Gap Analytics</h4>
                <p className="text-xs text-slate-500">Instant learning pathways for target roles.</p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-2">
                <Bot className="w-8 h-8 text-blue-600" />
                <h4 className="font-bold text-sm text-slate-900">AI Mock Interview</h4>
                <p className="text-xs text-slate-500">Interactive live question & scorecards.</p>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white shadow-lg space-y-2">
                <Award className="w-8 h-8 text-indigo-400" />
                <h4 className="font-bold text-sm">ATS Verified</h4>
                <p className="text-xs text-slate-400">Structural & keyword compliance check.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* HospiWise Screenshot 2 Inspired "Our Values & Capabilities" Section */}
      <section className="py-12 px-4 text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Our Mission to Revolutionize <span className="text-blue-600">Career Growth</span>
          </h2>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto" />
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            CareerAI is committed to enhancing job search transparency and recruiting efficiency through cutting-edge artificial intelligence. Our integrated portal empowers job seekers, recruiters, and administrators.
          </p>
        </div>

        {/* 4 Vertical Cards Grid Inspired by HospiWise Screenshot 2 */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">Smart Matching</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Evaluating skills, experience, and career goals to connect job seekers directly with ideal tech roles.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">Community</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Connecting recruiters and talent seamlessly to foster an efficient tech employment ecosystem.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">AI Intelligence</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Providing automated resume scoring, skill gap detection, and real-time interview evaluation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-left space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-blue-600">24/7 Support</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Round-the-clock access to AI career assistance, application tracking, and resume management.
            </p>
          </div>

        </div>
      </section>

      {/* Production Architecture Banner */}
      <section className="max-w-5xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-md text-center space-y-4">
        <div className="inline-flex items-center space-x-2 text-blue-700 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Production Architecture Active</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Full-Stack Django REST & React Vite Platform</h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto font-medium">
          JWT Authentication, CORS security policy, role-based access control, and real-time AI endpoints connected.
        </p>
      </section>

    </div>
  );
};

export default Home;
