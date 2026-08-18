import React from 'react';
import { Briefcase, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 py-12 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 shadow-md shadow-blue-500/20 flex items-center justify-center text-white font-extrabold text-sm tracking-wider">
                CA
              </div>
              <span className="text-lg font-extrabold text-slate-900">Career<span className="text-blue-600">AI</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering job seekers and employers with AI-driven matching, resume intelligence, and automated career insights.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Job Seekers</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="/jobs" className="text-slate-600 hover:text-blue-600 transition-colors">Browse Jobs</a></li>
              <li><a href="/resume-analyzer" className="text-slate-600 hover:text-blue-600 transition-colors">AI Resume Review</a></li>
              <li><a href="/mock-interview" className="text-slate-600 hover:text-blue-600 transition-colors">Mock Interviews</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Employers</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="/register" className="text-slate-600 hover:text-blue-600 transition-colors">Post a Job</a></li>
              <li><a href="/register" className="text-slate-600 hover:text-blue-600 transition-colors">Talent Matcher</a></li>
              <li><a href="/register" className="text-slate-600 hover:text-blue-600 transition-colors">Enterprise AI</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">Connect</h4>
            <div className="flex space-x-3">
              <a href="#" className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200/60">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200/60">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors border border-slate-200/60">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200/80 pt-6 text-center text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} CareerAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
