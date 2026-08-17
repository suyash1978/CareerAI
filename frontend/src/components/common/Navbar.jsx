import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Sparkles, User, LogOut, Search, Building, Target, Zap, FileText, MessageSquare } from 'lucide-react';
import { ROLES } from '../../utils/constants';

const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === ROLES.RECRUITER) return '/dashboard/recruiter';
    return '/dashboard/seeker';
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Career<span className="text-blue-500">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/jobs"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Explore Jobs</span>
            </Link>

            {isAuthenticated && role === ROLES.JOB_SEEKER && (
              <>
                <Link
                  to="/recommended-jobs"
                  className="flex items-center space-x-1.5 text-sm font-medium text-purple-300 hover:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full transition-colors"
                >
                  <Target className="w-4 h-4 text-purple-400" />
                  <span>AI Match</span>
                </Link>

                <Link
                  to="/skill-gap-analysis"
                  className="flex items-center space-x-1.5 text-sm font-medium text-amber-300 hover:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full transition-colors"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Skill Gap</span>
                </Link>

                <Link
                  to="/resume-analyzer"
                  className="flex items-center space-x-1.5 text-sm font-medium text-blue-300 hover:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full transition-colors"
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Resume Audit</span>
                </Link>

                <Link
                  to="/mock-interview"
                  className="flex items-center space-x-1.5 text-sm font-medium text-indigo-300 hover:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Mock Interview</span>
                </Link>
              </>
            )}

            <Link
              to="/ai-assistant"
              className="flex items-center space-x-1.5 text-sm font-medium text-indigo-300 hover:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              <span>AI Assistant</span>
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Actions / Profile Dropdown */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 px-3.5 py-1.5 rounded-full hover:border-blue-500 transition-colors"
                >
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    {user?.username}
                  </span>
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {role === ROLES.RECRUITER ? 'Recruiter' : 'Seeker'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
