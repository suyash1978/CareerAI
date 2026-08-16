import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

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
    <div className="max-w-md mx-auto my-12">
      <div className="glass-panel p-8 rounded-2xl shadow-2xl border border-slate-800">
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">
            Sign in to access your CareerAI dashboard
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
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

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-medium">
            Create an Account
          </Link>
        </div>

        {/* Quick Demo Credentials Assistant */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 mb-3 text-center">
            💡 Quick Demo Credentials (Click to Auto-Fill)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ username: 'seeker_demo', password: 'Password123!' })}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-left transition-all text-xs group"
            >
              <div className="font-semibold text-blue-400 group-hover:text-blue-300">Job Seeker</div>
              <div className="text-slate-300 font-mono text-[11px] mt-0.5">seeker_demo</div>
              <div className="text-slate-500 font-mono text-[10px]">Password123!</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ username: 'recruiter_demo', password: 'Password123!' })}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-left transition-all text-xs group"
            >
              <div className="font-semibold text-purple-400 group-hover:text-purple-300">Recruiter</div>
              <div className="text-slate-300 font-mono text-[11px] mt-0.5">recruiter_demo</div>
              <div className="text-slate-500 font-mono text-[10px]">Password123!</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ username: 'admin', password: 'Password123!' })}
              className="p-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl text-left transition-all text-xs group"
            >
              <div className="font-semibold text-amber-400 group-hover:text-amber-300">Admin</div>
              <div className="text-slate-300 font-mono text-[11px] mt-0.5">admin</div>
              <div className="text-slate-500 font-mono text-[10px]">Password123!</div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
