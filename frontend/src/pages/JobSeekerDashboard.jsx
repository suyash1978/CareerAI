import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User, Mail, Phone, MapPin, GraduationCap, Code, Briefcase,
  Linkedin, Github, Edit3, Save, CheckCircle, Sparkles, Loader2,
  FileText, Clock, Trash2, CheckCircle2, AlertCircle, XCircle, Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobApi } from '../api/jobApi';
import ResumeManager from '../components/jobs/ResumeManager';

const JobSeekerDashboard = () => {
  const { user, seekerProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'applications' | 'resumes'

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Applications & Stats State
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [appStats, setAppStats] = useState({
    total: 0,
    applied: 0,
    under_review: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  });

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    location: '',
    education: '',
    skills: '',
    experience: '',
    linkedin_url: '',
    github_url: '',
  });

  useEffect(() => {
    if (seekerProfile) {
      setFormData({
        full_name: seekerProfile.full_name || '',
        phone: seekerProfile.phone || '',
        location: seekerProfile.location || '',
        education: seekerProfile.education || '',
        skills: seekerProfile.skills || '',
        experience: seekerProfile.experience || '',
        linkedin_url: seekerProfile.linkedin_url || '',
        github_url: seekerProfile.github_url || '',
      });
    }
  }, [seekerProfile]);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchMyApplications();
      fetchStats();
    }
  }, [activeTab]);

  const fetchMyApplications = async () => {
    setLoadingApps(true);
    try {
      const data = await jobApi.getMyApplications();
      setMyApplications(data.results || data || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await jobApi.getApplicationStats();
      setAppStats(res);
    } catch (err) {
      console.error('Failed to fetch application stats', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateProfile({
        seeker_profile: formData
      });
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await jobApi.withdrawApplication(appId);
        fetchMyApplications();
        fetchStats();
      } catch (err) {
        console.error('Failed to withdraw application', err);
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'HIRED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SHORTLISTED':
      case 'INTERVIEW':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'UNDER_REVIEW':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 py-4">

      {/* HospiWise Styled Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center font-extrabold text-xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {seekerProfile?.full_name || user?.username}
                </h1>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 uppercase">
                  Job Seeker
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center space-x-2 font-medium">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.email}</span>
                {seekerProfile?.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{seekerProfile.location}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* HospiWise Segmented Tab Switcher */}
          <div className="flex items-center space-x-3">
            <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                Profile & Bio
              </button>

              <button
                onClick={() => setActiveTab('resumes')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'resumes'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Resumes & Parsing</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'applications'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Applications</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <>
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
              <h2 className="text-lg font-extrabold text-slate-900 mb-4">Edit Job Seeker Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="B.S. Computer Science - Stanford University"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">GitHub URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Technical Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, Python, Django, PostgreSQL, Tailwind CSS"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Experience Summary</label>
                <textarea
                  name="experience"
                  rows={4}
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Full-Stack Developer with 3+ years of experience building modern web applications..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Details Card */}
              <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <span>Background & Education</span>
                  </h3>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center space-x-1.5 text-xs text-blue-600 hover:underline font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="space-y-5 text-xs">
                  <div>
                    <span className="text-slate-400 block font-bold uppercase tracking-wider mb-1">EDUCATION</span>
                    <p className="text-slate-800 font-semibold text-sm">
                      {seekerProfile?.education || 'No education added yet.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-bold uppercase tracking-wider mb-2">TECHNICAL SKILLS</span>
                    <div className="flex flex-wrap gap-2">
                      {seekerProfile?.skills ? (
                        seekerProfile.skills.split(',').map((skill, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 font-bold text-xs">
                            {skill.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">No skills listed yet. Click edit profile to add your skills.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-bold uppercase tracking-wider mb-1">EXPERIENCE</span>
                    <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line text-xs sm:text-sm">
                      {seekerProfile?.experience || 'No work experience summary added yet.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links & Info Side Card */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
                <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">Contact & Links</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center space-x-3 text-slate-700 font-medium">
                    <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{seekerProfile?.phone || 'Phone not set'}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-700 font-medium">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{seekerProfile?.location || 'Location not set'}</span>
                  </div>

                  <div className="pt-2 space-y-2">
                    {seekerProfile?.linkedin_url && (
                      <a
                        href={seekerProfile.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200/60 text-blue-700 text-xs font-bold transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}

                    {seekerProfile?.github_url && (
                      <a
                        href={seekerProfile.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2 p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}
        </>
      )}

      {/* Resumes & Parsing Tab */}
      {activeTab === 'resumes' && (
        <ResumeManager />
      )}

      {/* Applications Tracking Tab */}
      {activeTab === 'applications' && (
        <div className="space-y-6">

          {/* Stats Widgets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <span className="text-xs font-bold text-slate-500">Total Applied</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{appStats.total}</div>
            </div>

            <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-700">Under Review</span>
              <div className="text-2xl font-extrabold text-indigo-800 mt-1">{appStats.under_review + appStats.applied}</div>
            </div>

            <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100">
              <span className="text-xs font-bold text-purple-700">Shortlisted / Interview</span>
              <div className="text-2xl font-extrabold text-purple-800 mt-1">{appStats.shortlisted + appStats.interview}</div>
            </div>

            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-700">Hired</span>
              <div className="text-2xl font-extrabold text-emerald-800 mt-1">{appStats.hired}</div>
            </div>
          </div>

          {/* Applications Stream */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">My Submitted Applications</h2>

            {loadingApps ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <span className="text-xs text-slate-500 font-semibold">Fetching your application statuses...</span>
              </div>
            ) : myApplications.length === 0 ? (
              <div className="bg-slate-50 p-10 rounded-2xl text-center space-y-4 border border-slate-200/60">
                <FileText className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No Applications Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                  You have not submitted applications for any job postings yet. Explore active tech jobs to apply.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md shadow-blue-500/25 transition-all mt-2"
                >
                  <span>Explore Jobs & Apply</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-base font-bold text-slate-900">{app.job_title}</h3>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-semibold mt-1">{app.job_company} • {app.job_location}</p>

                      <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2 font-medium">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                        </span>
                      </div>

                      {app.recruiter_notes && (
                        <div className="mt-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-800">
                          <span className="font-bold text-indigo-900 block mb-0.5">Recruiter Feedback:</span>
                          <p className="font-medium">{app.recruiter_notes}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors"
                      title="Withdraw Application"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Withdraw</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default JobSeekerDashboard;
