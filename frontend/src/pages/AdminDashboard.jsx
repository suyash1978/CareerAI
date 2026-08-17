import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Briefcase, FileText, TrendingUp, Search, UserCheck,
  UserX, ShieldAlert, CheckCircle2, AlertCircle, Trash2, Eye, RefreshCw, Loader2,
  Building, Award, Activity
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ANALYTICS'); // 'ANALYTICS' | 'USERS' | 'JOBS' | 'APPLICATIONS'

  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [appsList, setAppsList] = useState([]);

  // Filters & Loading
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('');

  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'USERS') fetchUsers();
    else if (activeTab === 'JOBS') fetchJobs();
    else if (activeTab === 'APPLICATIONS') fetchApplications();
  }, [activeTab, roleFilter, searchQuery, jobStatusFilter]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch admin analytics', err);
      setError('Failed to load platform analytics. Ensure you have ADMIN credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getUsers({ role: roleFilter, search: searchQuery });
      setUsersList(data || []);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getJobs({ status: jobStatusFilter });
      setJobsList(data || []);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getApplications();
      setAppsList(data || []);
    } catch (err) {
      console.error('Failed to fetch applications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentActive) => {
    try {
      const res = await adminApi.toggleUserStatus(userId, !currentActive);
      setActionSuccess(res.message);
      fetchUsers();
      fetchAnalytics();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update user status', err);
    }
  };

  const handleModerateJob = async (jobId, action) => {
    if (action === 'DELETE' && !window.confirm('Delete this job posting permanently?')) return;

    try {
      const res = await adminApi.moderateJob(jobId, action);
      setActionSuccess(res.message);
      fetchJobs();
      fetchAnalytics();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to moderate job', err);
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 text-white shadow-lg shadow-rose-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">Platform Admin Control Center</h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time platform analytics, user moderation, job post oversight, and application metrics
              </p>
            </div>
          </div>

          <button
            onClick={() => { fetchAnalytics(); if (activeTab === 'USERS') fetchUsers(); if (activeTab === 'JOBS') fetchJobs(); }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all self-start md:self-auto"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-6 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'ANALYTICS'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Analytics & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'USERS'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management</span>
        </button>

        <button
          onClick={() => setActiveTab('JOBS')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'JOBS'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Post Moderation</span>
        </button>

        <button
          onClick={() => setActiveTab('APPLICATIONS')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'APPLICATIONS'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Platform Applications</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & OVERVIEW */}
      {activeTab === 'ANALYTICS' && analytics && (
        <div className="space-y-8">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Total Users</span>
              <span className="text-2xl font-extrabold text-white">{analytics.users.total}</span>
              <span className="text-[10px] text-slate-500 block">
                {analytics.users.seekers} Seekers • {analytics.users.recruiters} Recruiters
              </span>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Active Job Postings</span>
              <span className="text-2xl font-extrabold text-emerald-400">{analytics.jobs.active}</span>
              <span className="text-[10px] text-slate-500 block">Out of {analytics.jobs.total} total jobs</span>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Total Applications</span>
              <span className="text-2xl font-extrabold text-blue-400">{analytics.applications.total}</span>
              <span className="text-[10px] text-slate-500 block">Submitted platform-wide</span>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">Hired Candidates</span>
              <span className="text-2xl font-extrabold text-purple-400">
                {analytics.applications.by_status.HIRED || 0}
              </span>
              <span className="text-[10px] text-slate-500 block">Successful matches</span>
            </div>
          </div>

          {/* Application Status Funnel */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Application Pipeline Distribution</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              <div className="glass-card p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block text-[11px]">APPLIED</span>
                <span className="text-lg font-bold text-blue-400">{analytics.applications.by_status.APPLIED}</span>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block text-[11px]">UNDER REVIEW</span>
                <span className="text-lg font-bold text-indigo-400">{analytics.applications.by_status.UNDER_REVIEW}</span>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block text-[11px]">SHORTLISTED</span>
                <span className="text-lg font-bold text-purple-400">{analytics.applications.by_status.SHORTLISTED}</span>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block text-[11px]">INTERVIEW</span>
                <span className="text-lg font-bold text-amber-400">{analytics.applications.by_status.INTERVIEW}</span>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block text-[11px]">HIRED</span>
                <span className="text-lg font-bold text-emerald-400">{analytics.applications.by_status.HIRED}</span>
              </div>

              <div className="glass-card p-3 rounded-2xl border border-slate-800 text-center space-y-1">
                <span className="text-slate-400 block text-[11px]">REJECTED</span>
                <span className="text-lg font-bold text-rose-400">{analytics.applications.by_status.REJECTED}</span>
              </div>
            </div>
          </div>

          {/* Top Skills & Active Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Skills */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Award className="w-4 h-4 text-purple-400" />
                <span>Top Platform Skills</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {analytics.top_skills.map((item, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold flex items-center space-x-1.5">
                    <span>{item.skill}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-200">
                      {item.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Most Active Companies */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Building className="w-4 h-4 text-blue-400" />
                <span>Most Active Hiring Companies</span>
              </h3>

              <div className="space-y-2 text-xs">
                {analytics.active_companies.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-white">{c.company}</span>
                    <span className="text-blue-400 font-semibold">{c.count} Job Postings</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Registrations Feed */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Recent User Registrations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {analytics.recent_registrations.map((u) => (
                <div key={u.id} className="glass-card p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{u.username}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{u.email}</p>
                  <span className="text-slate-500 text-[10px] block">{u.date_joined}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by username or email..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value="">All Roles</option>
                <option value="JOB_SEEKER">Job Seekers</option>
                <option value="RECRUITER">Recruiters</option>
                <option value="ADMIN">Admins</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Loading platform user accounts...</span>
            </div>
          ) : usersList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No users found matching search criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date Joined</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40">
                      <td className="py-3 font-bold text-white">{u.username}</td>
                      <td className="py-3 text-slate-300">{u.email}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        {u.is_active ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-400">{u.date_joined}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                          className={`px-3 py-1 rounded-lg font-semibold text-[11px] transition-all ${
                            u.is_active
                              ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                          }`}
                        >
                          {u.is_active ? 'Block User' : 'Unblock User'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: JOB MODERATION */}
      {activeTab === 'JOBS' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Job Post Moderation Queue</span>
            </h3>

            <select
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Jobs</option>
              <option value="CLOSED">Closed / Moderated</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Loading job postings...</span>
            </div>
          ) : jobsList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No job postings found.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {jobsList.map((job) => (
                <div key={job.id} className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-white text-sm">{job.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        job.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <p className="text-slate-400">
                      Company: <strong className="text-slate-200">{job.company}</strong> • Recruiter: {job.recruiter_email}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      Posted: {job.created_at} • Applicants: {job.applications_count}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {job.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleModerateJob(job.id, 'MODERATE')}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:text-white font-semibold"
                      >
                        Flag & Close
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModerateJob(job.id, 'APPROVE')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:text-white font-semibold"
                      >
                        Approve Active
                      </button>
                    )}

                    <button
                      onClick={() => handleModerateJob(job.id, 'DELETE')}
                      className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:text-white transition-colors"
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
      )}

      {/* TAB 4: PLATFORM APPLICATIONS OVERSIGHT */}
      {activeTab === 'APPLICATIONS' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Platform-Wide Job Applications Oversight</span>
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-400 text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
              <span>Loading platform applications...</span>
            </div>
          ) : appsList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No job applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Target Job & Company</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Applied At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {appsList.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-900/40">
                      <td className="py-3">
                        <span className="font-bold text-white block">{app.applicant_name}</span>
                        <span className="text-slate-500 text-[11px]">{app.applicant_email}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-200 block">{app.job_title}</span>
                        <span className="text-slate-400 text-[11px]">{app.company}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{app.applied_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
