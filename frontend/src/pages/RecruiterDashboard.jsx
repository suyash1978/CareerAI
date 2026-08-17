import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Building, MapPin, User, Mail, Briefcase, Plus,
  Edit3, Save, CheckCircle, Loader2, Users, Trash2, Power, Eye
} from 'lucide-react';
import { jobApi } from '../api/jobApi';
import JobFormModal from '../components/jobs/JobFormModal';
import ApplicantsModal from '../components/jobs/ApplicantsModal';

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
    <div className="space-y-8 py-4 transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {recruiterProfile?.company_name || user?.username}
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 uppercase tracking-wider">
                  Recruiter Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2 font-medium">
                <User className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
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
              className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Company Info'}</span>
            </button>

            <button
              onClick={handleCreateNewJob}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Job</span>
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Recruiter Stats Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Total Positions</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{myJobs.length}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Total Applicants</span>
          <div className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 mt-1">{appStats.total}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">Shortlisted / Interview</span>
          <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">{appStats.shortlisted + appStats.interview}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Hired</span>
          <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">{appStats.hired}</div>
        </div>
      </div>

      {/* Edit Company Profile Form */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Edit Recruiter & Company Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleProfileChange}
                placeholder="Acme Innovations Inc."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Your Designation / Title</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleProfileChange}
                placeholder="Head of Talent Acquisition"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Website</label>
              <input
                type="url"
                name="company_website"
                value={formData.company_website}
                onChange={handleProfileChange}
                placeholder="https://company.com"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Location</label>
              <input
                type="text"
                name="company_location"
                value={formData.company_location}
                onChange={handleProfileChange}
                placeholder="New York, NY / Remote"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Description</label>
            <textarea
              name="company_description"
              rows={4}
              value={formData.company_description}
              onChange={handleProfileChange}
              placeholder="Tell applicants about your company culture, mission, and technology stack..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Company Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* Posted Jobs Management Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Posted Job Listings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage positions, toggle active status, and review applicant candidate profiles</p>
          </div>

          <button
            onClick={handleCreateNewJob}
            className="hidden sm:inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Post Position</span>
          </button>
        </div>

        {loadingJobs ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
            <span className="text-xs text-slate-500 font-medium">Loading your job listings...</span>
          </div>
        ) : myJobs.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <Briefcase className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Jobs Posted Yet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You have not published any job opportunities yet. Click "Post New Job" above to start receiving candidates.
            </p>
            <button
              onClick={handleCreateNewJob}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all mt-2"
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
                className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      job.status === 'ACTIVE'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                        : job.status === 'CLOSED'
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{job.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{job.job_type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-purple-500" />
                      <span>{job.applications_count} Applicants</span>
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleViewApplicants(job)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-colors"
                    title="View Applicants"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Applicants ({job.applications_count})</span>
                  </button>

                  <button
                    onClick={() => handleToggleStatus(job.id)}
                    className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      job.status === 'ACTIVE'
                        ? 'bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                    }`}
                    title={job.status === 'ACTIVE' ? 'Close Job' : 'Reopen Job'}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{job.status === 'ACTIVE' ? 'Close' : 'Reopen'}</span>
                  </button>

                  <button
                    onClick={() => handleEditJob(job)}
                    className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
                    title="Edit Job"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 transition-colors"
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
