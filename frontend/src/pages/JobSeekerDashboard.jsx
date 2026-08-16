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
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'SHORTLISTED':
      case 'INTERVIEW':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'UNDER_REVIEW':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'REJECTED':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">
                  {seekerProfile?.full_name || user?.username}
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase">
                  Job Seeker
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
                {seekerProfile?.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{seekerProfile.location}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Profile & Bio
              </button>

              <button
                onClick={() => setActiveTab('resumes')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'resumes'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Resumes & Parsing</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'applications'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
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
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <>
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
              <h2 className="text-lg font-bold text-white mb-4">Edit Job Seeker Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Education</label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    placeholder="B.S. Computer Science - Stanford University"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Technical Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, JavaScript, Python, Django, PostgreSQL, Tailwind CSS"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Work Experience Summary</label>
                <textarea
                  name="experience"
                  rows={4}
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Full-Stack Developer with 3+ years of experience building modern web applications..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Details Card */}
              <div className="md:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <GraduationCap className="w-5 h-5 text-blue-400" />
                    <span>Background & Education</span>
                  </h3>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center space-x-1.5 text-xs text-blue-400 hover:underline font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-slate-500 block font-semibold mb-1">EDUCATION</span>
                    <p className="text-slate-200 font-medium">
                      {seekerProfile?.education || 'No education added yet.'}
                    </p>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold mb-1">TECHNICAL SKILLS</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {seekerProfile?.skills ? (
                        seekerProfile.skills.split(',').map((skill, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
                            {skill.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">No skills listed yet. Click edit profile to add your skills.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block font-semibold mb-1">EXPERIENCE</span>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                      {seekerProfile?.experience || 'No work experience summary added yet.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links & Info Side Card */}
              <div className="glass-card p-6 rounded-3xl space-y-6">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Contact & Links</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center space-x-3 text-slate-300">
                    <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>{seekerProfile?.phone || 'Phone not set'}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-300">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>{seekerProfile?.location || 'Location not set'}</span>
                  </div>

                  <div className="pt-2 space-y-2">
                    {seekerProfile?.linkedin_url && (
                      <a
                        href={seekerProfile.linkedin_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-blue-400 text-xs font-semibold transition-colors"
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
                        className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
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
            <div className="glass-card p-5 rounded-2xl">
              <span className="text-[11px] font-semibold text-slate-400">Total Applied</span>
              <div className="text-2xl font-extrabold text-white mt-1">{appStats.total}</div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-[11px] font-semibold text-indigo-400">Under Review</span>
              <div className="text-2xl font-extrabold text-indigo-300 mt-1">{appStats.under_review + appStats.applied}</div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-[11px] font-semibold text-purple-400">Shortlisted / Interview</span>
              <div className="text-2xl font-extrabold text-purple-300 mt-1">{appStats.shortlisted + appStats.interview}</div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <span className="text-[11px] font-semibold text-emerald-400">Hired</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{appStats.hired}</div>
            </div>
          </div>

          {/* Applications Stream */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3">My Submitted Applications</h2>

            {loadingApps ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                <span className="text-xs text-slate-400 font-medium">Fetching your application statuses...</span>
              </div>
            ) : myApplications.length === 0 ? (
              <div className="glass-card p-10 rounded-2xl text-center space-y-4">
                <FileText className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-lg font-bold text-white">No Applications Yet</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  You have not submitted applications for any job postings yet. Explore active tech jobs to apply.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all mt-2"
                >
                  <span>Explore Jobs & Apply</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-base font-bold text-white">{app.job_title}</h3>
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-semibold mt-0.5">{app.job_company} • {app.job_location}</p>

                      <div className="flex items-center space-x-4 text-xs text-slate-500 mt-2">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                        </span>
                      </div>

                      {app.recruiter_notes && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-indigo-300">
                          <span className="font-semibold text-slate-400 block mb-0.5">Recruiter Feedback:</span>
                          <p>{app.recruiter_notes}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleWithdraw(app.id)}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
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
