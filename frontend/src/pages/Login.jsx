import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, Loader2, Eye, EyeOff, Briefcase, UserCheck, KeyRound } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleFillDemo = (username, password) => {
    setFormData({ username, password });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Failed to sign in. Please check your username and password.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your CareerAI workspace
          </p>
        </div>

        {/* Demo Account Fill Helper */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block text-center">
            ⚡ Quick Demo Sign-In
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('Suyash', 'Password123!')}
              className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Job Seeker</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('recruiter_demo', 'Password123!')}
              className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Recruiter</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username (e.g. Suyash)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 text-sm mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
            Create Free Account
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
