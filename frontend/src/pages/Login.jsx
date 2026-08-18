import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        'Failed to sign in. Please check your credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Side: HospiWise Styled Soft Blue Feature/Illustration Banner */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50/60 to-blue-100/40 p-8 sm:p-10 flex flex-col justify-between text-center relative border-b md:border-b-0 md:border-r border-slate-200/60">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Intelligence Portal</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Welcome Back to <span className="text-blue-600">CareerAI</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Access your personalized job matches, AI resume audits, and interview preparation suite.
            </p>
          </div>

          <div className="my-8 py-6 px-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-sm max-w-xs mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">100% Data Protection</p>
            <p className="text-[11px] text-slate-500">Your profile data and resume analytics are protected with enterprise security.</p>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            AI-Powered Smart Job Portal & Career Assistant
          </p>
        </div>

        {/* Right Side: Clean Form Container */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">

          <div className="text-left mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Welcome Back!</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Please sign in to your account
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2.5 text-rose-600 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-500/25 transition-all disabled:opacity-50 text-sm mt-2"
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

          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline font-bold">
              Sign up
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
