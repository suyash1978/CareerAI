import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Sparkles, User, LogOut, Search, Target, Zap, FileText, MessageSquare } from 'lucide-react';
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
    if (role === ROLES.ADMIN) return '/dashboard/admin';
    return '/dashboard/seeker';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* HospiWise Styled Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 shadow-md shadow-blue-500/25 flex items-center justify-center text-white font-extrabold text-lg tracking-wider group-hover:scale-105 transition-transform duration-200">
              CA
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Career<span className="text-blue-600">AI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/jobs"
              className="flex items-center space-x-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Explore Jobs</span>
            </Link>

            {isAuthenticated && role === ROLES.JOB_SEEKER && (
              <>
                <Link
                  to="/recommended-jobs"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Target className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Match</span>
                </Link>

                <Link
                  to="/skill-gap-analysis"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-3 py-1.5 rounded-full transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Skill Gap</span>
                </Link>

                <Link
                  to="/resume-analyzer"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3 py-1.5 rounded-full transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Resume Audit</span>
                </Link>

                <Link
                  to="/mock-interview"
                  className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-3 py-1.5 rounded-full transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Mock Interview</span>
                </Link>
              </>
            )}

            <Link
              to="/ai-assistant"
              className="flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 px-3 py-1.5 rounded-full transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>AI Assistant</span>
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className="text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Actions / Profile Dropdown */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 bg-slate-100 border border-slate-200/80 px-3.5 py-1.5 rounded-full hover:border-blue-300 transition-colors"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">
                    {user?.username}
                  </span>
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                    {role === ROLES.RECRUITER ? 'Recruiter' : role === ROLES.ADMIN ? 'Admin' : 'Seeker'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 px-4 py-2 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition-all"
                >
                  Register
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
