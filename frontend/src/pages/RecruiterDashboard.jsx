import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Building, Globe, MapPin, User, Mail, Briefcase, Plus,
  Edit3, Save, CheckCircle, Loader2, Users, Trash2, Power, Eye, AlertCircle
} from 'lucide-react';
import { jobApi } from '../api/jobApi';
import JobFormModal from '../components/jobs/JobFormModal';
import ApplicantsModal from '../components/jobs/ApplicantsModal';
import ApplicantDetailModal from '../components/jobs/ApplicantDetailModal';

const RecruiterDashboard = () => {
  const { user, recruiterProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Jobs state
  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // App Stats State
  const [appStats, setAppStats] = useState({
    total: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
  });

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    company_description: '',
    company_website: '',
    company_location: '',
    designation: '',
  });

  useEffect(() => {
    if (recruiterProfile) {
      setFormData({
        company_name: recruiterProfile.company_name || '',
        company_description: recruiterProfile.company_description || '',
        company_website: recruiterProfile.company_website || '',
        company_location: recruiterProfile.company_location || '',
        designation: recruiterProfile.designation || '',
      });
    }
  }, [recruiterProfile]);

  useEffect(() => {
    fetchMyJobs();
    fetchStats();
  }, []);

  const fetchMyJobs = async () => {
    setLoadingJobs(true);
    try {
      const data = await jobApi.getMyPostedJobs();
      setMyJobs(data.results || data || []);
    } catch (err) {
      console.error('Failed to fetch recruiter posted jobs', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await jobApi.getApplicationStats();
      setAppStats(res);
    } catch (err) {
      console.error('Failed to fetch recruiter app stats', err);
    }
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      await updateProfile({
        recruiter_profile: formData
      });
      setSuccessMsg('Company profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update recruiter profile', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNewJob = () => {
    setJobToEdit(null);
    setIsJobModalOpen(true);
  };

  const handleEditJob = (job) => {
    setJobToEdit(job);
    setIsJobModalOpen(true);
  };

  const handleToggleStatus = async (jobId) => {
    try {
      await jobApi.toggleJobStatus(jobId);
      fetchMyJobs();
    } catch (err) {
      console.error('Failed to toggle job status', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await jobApi.deleteJob(jobId);
        fetchMyJobs();
        fetchStats();
      } catch (err) {
        console.error('Failed to delete job', err);
      }
    }
  };

  const handleViewApplicants = (job) => {
    setSelectedJobForApplicants(job);
    setIsApplicantsModalOpen(true);
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">
                  {recruiterProfile?.company_name || user?.username}
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                  Recruiter Portal
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{recruiterProfile?.designation || 'Hiring Manager'}</span>
                <span>•</span>
                <Mail className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Company Info'}</span>
            </button>

            <button
              onClick={handleCreateNewJob}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Recruiter Stats Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400">Total Positions</span>
          <div className="text-2xl font-extrabold text-white mt-1">{myJobs.length}</div>
        </div>

        <div className="glass-card p-5 rounded-2xl">
          <span className="text-[11px] font-semibold text-indigo-400">Total Applicants</span>
          <div className="text-2xl font-extrabold text-indigo-300 mt-1">{appStats.total}</div>
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

      {/* Edit Company Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white mb-4">Edit Recruiter & Company Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleProfileChange}
                placeholder="Acme Innovations Inc."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Designation / Title</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleProfileChange}
                placeholder="Head of Talent Acquisition"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Website</label>
              <input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleProfileChange}
                placeholder="https://company.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Location</label>
              <input
                type="text"
                name="company_location"
                value={formData.company_location}
                onChange={handleProfileChange}
                placeholder="New York, NY / Remote"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Company Description</label>
            <textarea
              name="company_description"
              rows={4}
              value={formData.company_description}
              onChange={handleProfileChange}
              placeholder="Tell applicants about your company culture, mission, and technology stack..."
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
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Company Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Posted Jobs Management Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Posted Job Listings</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage positions, toggle active status, and review applicant candidate profiles</p>
          </div>

          <button
            onClick={handleCreateNewJob}
            className="hidden sm:inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Post Position</span>
          </button>
        </div>

        {loadingJobs ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
            <span className="text-xs text-slate-400 font-medium">Loading your job listings...</span>
          </div>
        ) : myJobs.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center space-y-4">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Jobs Posted Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              You have not published any job opportunities yet. Click "Post New Job" above to start receiving candidates.
            </p>
            <button
              onClick={handleCreateNewJob}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Job Posting</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myJobs.map((job) => (
              <div
                key={job.id}
                className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-bold text-white">{job.title}</h3>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      job.status === 'ACTIVE'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : job.status === 'CLOSED'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{job.job_type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>{job.applications_count} Applicants</span>
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewApplicants(job)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                    title="View Applicants"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Applicants ({job.applications_count})</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(job.id)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      job.status === 'ACTIVE'
                        ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                    title={job.status === 'ACTIVE' ? 'Close Job' : 'Reopen Job'}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{job.status === 'ACTIVE' ? 'Close' : 'Reopen'}</span>
                  </button>

                  <button
                    onClick={() => handleEditJob(job)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Edit Job"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <JobFormModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        jobToEdit={jobToEdit}
        onJobSaved={fetchMyJobs}
      />

      <ApplicantsModal
        isOpen={isApplicantsModalOpen}
        onClose={() => { setIsApplicantsModalOpen(false); fetchStats(); }}
        job={selectedJobForApplicants}
      />

    </div>
  );
};

export default RecruiterDashboard;
