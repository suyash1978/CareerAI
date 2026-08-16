import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, Bot, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center py-16 px-4">
        {/* Glow backdrop effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation AI Job Matching Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Accelerate Your Tech Career With{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            Discover tailored career opportunities, optimize your resume with real-time AI feedback, and connect with top tech employers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Explore Top Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/ai-assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 glass-panel border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 font-medium px-8 py-3.5 rounded-xl transition-all"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Try AI Career Assistant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-6 rounded-2xl">
          <div className="p-3 w-fit rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Smart Job Matching</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Algorithmic recommendations that evaluate your skills, experience, and career trajectory to match you with target roles.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="p-3 w-fit rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
            <Bot className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">AI Resume Optimizer</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Get instant actionable feedback on resume keywords, structural improvements, and match rates against job descriptions.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="p-3 w-fit rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Career Insights</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Real-time market salary benchmarks, skill demand trends, and personalized learning pathways.
          </p>
        </div>
      </section>

      {/* Quick Architecture Callout */}
      <section className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Production Ready Scaffolding Active</span>
        </div>
        <h2 className="text-2xl font-bold text-white">Full-Stack Django REST & React Vite Connected</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          JWT Authentication, CORS policy, custom user role management, and API proxy routing ready for module expansion.
        </p>
      </section>

    </div>
  );
};

export default Home;
