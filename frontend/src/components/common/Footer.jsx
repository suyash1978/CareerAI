import React from 'react';
import { Briefcase, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#080b12] border-t border-slate-800/80 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-blue-600">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">CareerAI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering job seekers and employers with AI-driven matching, resume intelligence, and automated career insights.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Job Seekers</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/jobs" className="hover:text-blue-400 transition-colors">Browse Jobs</a></li>
              <li><a href="/ai-assistant" className="hover:text-blue-400 transition-colors">AI Resume Review</a></li>
              <li><a href="/ai-assistant" className="hover:text-blue-400 transition-colors">Career Advice</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Employers</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/register" className="hover:text-blue-400 transition-colors">Post a Job</a></li>
              <li><a href="/register" className="hover:text-blue-400 transition-colors">Talent Matcher</a></li>
              <li><a href="/register" className="hover:text-blue-400 transition-colors">Enterprise AI</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800/60 pt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerAI. Production Ready Scaffolding Architecture.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
