import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building, AlertCircle, Loader2, UserCheck, Briefcase, Phone, BadgeCheck, Eye, EyeOff, UserPlus } from 'lucide-react';
import { ROLES } from '../utils/constants';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    role: ROLES.JOB_SEEKER,
    full_name: '',
    phone: '',
    company_name: '',
    designation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      const respData = err.response?.data;
      if (respData && typeof respData === 'object') {
        if (respData.detail) {
          setError(String(respData.detail));
        } else if (respData.non_field_errors) {
          setError(Array.isArray(respData.non_field_errors) ? respData.non_field_errors[0] : String(respData.non_field_errors));
        } else {
          const keys = Object.keys(respData);
          if (keys.length > 0) {
            const firstKey = keys[0];
            const val = respData[firstKey];
            const msg = Array.isArray(val) ? val[0] : String(val);
            setError(`${firstKey}: ${msg}`);
          } else {
            setError('Failed to create account. Please verify input data.');
          }
        }
      } else if (!err.response || err.message?.includes('Network Error')) {
        setError('Network connection failed. Unable to reach backend server. Please check connection/CORS configuration.');
      } else {
        setError('Failed to create account. Please verify input data.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Your CareerAI Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your role to personalize your AI career assistant workspace
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center space-x-2 text-rose-600 dark:text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: ROLES.JOB_SEEKER })}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                  formData.role === ROLES.JOB_SEEKER
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Job Seeker</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: ROLES.RECRUITER })}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                  formData.role === ROLES.RECRUITER
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-600 text-purple-600 dark:text-purple-400 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Recruiter</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="john_doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          {/* Role Specific Fields */}
          {formData.role === ROLES.JOB_SEEKER ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 555-0199"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    name="company_name"
                    required={formData.role === ROLES.RECRUITER}
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Acme Corporation"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Designation</label>
                <div className="relative">
                  <BadgeCheck className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="Talent Lead"
                    className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
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

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password_confirm"
                  required
                  value={formData.password_confirm}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 mt-2 text-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering Account...</span>
              </>
            ) : (
              <span>Create Free Account</span>
            )}
          </button>

        </form>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
