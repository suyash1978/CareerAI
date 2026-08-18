import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Building, AlertCircle, Loader2, UserCheck, Briefcase, Phone, BadgeCheck, Sparkles, CheckCircle2 } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto my-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 md:grid-cols-12">

        {/* Left Side (Form Area) - HospiWise Screenshot 4 Layout */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">

          <div className="text-left mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Join our AI-powered career platform today
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center space-x-2.5 text-rose-600 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* HospiWise Segmented Role Switcher Control */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Profile Type
              </label>
              <div className="bg-slate-100 p-1.5 rounded-2xl flex border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: ROLES.JOB_SEEKER })}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    formData.role === ROLES.JOB_SEEKER
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Job Seeker</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: ROLES.RECRUITER })}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    formData.role === ROLES.RECRUITER
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Recruiter</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="john_doe"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Role Specific Fields Box - HospiWise Tinted Panel */}
            {formData.role === ROLES.JOB_SEEKER ? (
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100/80 space-y-3">
                <div className="flex items-center space-x-1.5 text-blue-700 font-bold text-xs">
                  <UserCheck className="w-4 h-4" />
                  <span>Job Seeker Profile Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 555-0199"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100/80 space-y-3">
                <div className="flex items-center space-x-1.5 text-indigo-700 font-bold text-xs">
                  <Briefcase className="w-4 h-4" />
                  <span>Recruiter & Company Info</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Company Name</label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        name="company_name"
                        required={formData.role === ROLES.RECRUITER}
                        value={formData.company_name}
                        onChange={handleChange}
                        placeholder="Acme Corporation"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Designation</label>
                    <div className="relative">
                      <BadgeCheck className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Talent Lead"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    name="password_confirm"
                    required
                    value={formData.password_confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Register as {formData.role === ROLES.RECRUITER ? 'Recruiter' : 'Job Seeker'}</span>
              )}
            </button>

          </form>

          <div className="mt-6 text-center text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-bold">
              Sign in
            </Link>
          </div>

        </div>

        {/* Right Side Promo Panel - HospiWise Screenshot 4 Layout */}
        <div className="md:col-span-5 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-100/30 p-8 sm:p-10 flex flex-col justify-between text-center border-t md:border-t-0 md:border-l border-slate-200/60">
          <div className="space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Welcome to <span className="text-blue-600">CareerAI</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
              Join us to accelerate your tech career journey effectively with real-time AI guidance and algorithmic matching.
            </p>

            <div className="pt-4 space-y-2 max-w-xs mx-auto text-left">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white/80 p-2.5 rounded-xl border border-blue-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>AI Skill Gap & Resume Audits</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white/80 p-2.5 rounded-xl border border-blue-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Algorithmic Job Match Engine</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 bg-white/80 p-2.5 rounded-xl border border-blue-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>Interactive AI Mock Interviews</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium pt-6">
            © {new Date().getFullYear()} CareerAI • Secure & Verified
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
