import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Briefcase, Sparkles, User, LogOut, Search, Target, Zap, FileText,
  MessageSquare, Sun, Moon, Menu, X, ChevronRight, LayoutDashboard
} from 'lucide-react';
import { ROLES } from '../../utils/constants';

const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === ROLES.RECRUITER) return '/dashboard/recruiter';
    if (role === ROLES.ADMIN) return '/dashboard/admin';
    return '/dashboard/seeker';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Career<span className="text-blue-600 dark:text-blue-500">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to="/jobs"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/jobs')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Explore Jobs</span>
            </Link>

            {isAuthenticated && role === ROLES.JOB_SEEKER && (
              <>
                <Link
                  to="/recommended-jobs"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/recommended-jobs')
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>AI Match</span>
                </Link>

                <Link
                  to="/skill-gap-analysis"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/skill-gap-analysis')
                      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Skill Gap</span>
                </Link>

                <Link
                  to="/resume-analyzer"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/resume-analyzer')
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-blue-500" />
                  <span>Resume Audit</span>
                </Link>

                <Link
                  to="/mock-interview"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive('/mock-interview')
                      ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
                  <span>Mock Interview</span>
                </Link>
              </>
            )}

            <Link
              to="/ai-assistant"
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                isActive('/ai-assistant')
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  location.pathname.startsWith('/dashboard')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Controls: Theme Toggle + Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2.5">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl hover:border-blue-500 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {user?.username}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                    {role === ROLES.RECRUITER ? 'Recruiter' : role === ROLES.ADMIN ? 'Admin' : 'Seeker'}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle Controls */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-blue-500" />
                <span>Explore Jobs</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {isAuthenticated && role === ROLES.JOB_SEEKER && (
              <>
                <Link
                  to="/recommended-jobs"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>AI Job Match</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/skill-gap-analysis"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Skill Gap Analysis</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/resume-analyzer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Resume Audit</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/mock-interview"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                >
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Mock Interview</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}

            <Link
              to="/ai-assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Assistant</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>

            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                <div className="flex items-center space-x-2">
                  <LayoutDashboard className="w-4 h-4 text-blue-500" />
                  <span>Dashboard</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user?.username}</span>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="flex items-center space-x-1 text-xs font-semibold text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 py-2.5 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-xs font-semibold text-white bg-blue-600 py-2.5 rounded-xl shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
