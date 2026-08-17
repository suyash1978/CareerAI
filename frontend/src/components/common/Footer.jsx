import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-400 py-12 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div className="space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Career<span className="text-blue-600 dark:text-blue-500">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Empowering job seekers and employers with AI-driven matching, resume intelligence, and automated career insights.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Job Seekers
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/jobs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Explore Active Jobs</Link></li>
              <li><Link to="/recommended-jobs" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Job Matching</Link></li>
              <li><Link to="/resume-analyzer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Resume AI Audit</Link></li>
              <li><Link to="/mock-interview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Mock Interview Prep</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform & AI
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/ai-assistant" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">AI Career Assistant</Link></li>
              <li><Link to="/skill-gap-analysis" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Skill Gap Analyzer</Link></li>
              <li><Link to="/register" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Recruiter Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Connect & Community
            </h4>
            <div className="flex space-x-2">
              <a href="#" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200/80 dark:border-slate-800/80 pt-6 text-center text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} CareerAI. Intelligent Smart Job Portal & Career Assistant.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
