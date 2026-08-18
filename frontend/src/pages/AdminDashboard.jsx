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

      {/* HospiWise Styled Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center font-extrabold text-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Admin Control Center</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Real-time platform analytics, user moderation, job post oversight, and application metrics
              </p>
            </div>
          </div>

          <button
            onClick={() => { fetchAnalytics(); if (activeTab === 'USERS') fetchUsers(); if (activeTab === 'JOBS') fetchJobs(); }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs self-start md:self-auto"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* HospiWise Segmented Admin Navigation Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 inline-flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ANALYTICS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Analytics & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'USERS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management</span>
        </button>

        <button
          onClick={() => setActiveTab('JOBS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'JOBS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Post Moderation</span>
        </button>

        <button
          onClick={() => setActiveTab('APPLICATIONS')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'APPLICATIONS'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:text-slate-900'
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
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500 block">Total Users</span>
              <span className="text-2xl font-extrabold text-slate-900">{analytics.users.total}</span>
              <span className="text-[10px] text-slate-400 font-medium block">
                {analytics.users.seekers} Seekers • {analytics.users.recruiters} Recruiters
              </span>
            </div>

            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 space-y-1">
              <span className="text-xs font-bold text-emerald-700 block">Active Job Postings</span>
              <span className="text-2xl font-extrabold text-emerald-900">{analytics.jobs.active}</span>
              <span className="text-[10px] text-emerald-600 font-medium block">Out of {analytics.jobs.total} total jobs</span>
            </div>

            <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-100 space-y-1">
              <span className="text-xs font-bold text-blue-700 block">Total Applications</span>
              <span className="text-2xl font-extrabold text-blue-900">{analytics.applications.total}</span>
              <span className="text-[10px] text-blue-600 font-medium block">Submitted platform-wide</span>
            </div>

            <div className="bg-purple-50/60 p-5 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-xs font-bold text-purple-700 block">Hired Candidates</span>
              <span className="text-2xl font-extrabold text-purple-900">
                {analytics.applications.by_status.HIRED || 0}
              </span>
              <span className="text-[10px] text-purple-600 font-medium block">Successful matches</span>
            </div>
          </div>

          {/* Application Status Funnel */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Application Pipeline Distribution</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100 text-center space-y-1">
                <span className="text-blue-600 block text-[11px] font-bold">APPLIED</span>
                <span className="text-lg font-extrabold text-blue-900">{analytics.applications.by_status.APPLIED}</span>
              </div>

              <div className="bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 text-center space-y-1">
                <span className="text-indigo-600 block text-[11px] font-bold">UNDER REVIEW</span>
                <span className="text-lg font-extrabold text-indigo-900">{analytics.applications.by_status.UNDER_REVIEW}</span>
              </div>

              <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-100 text-center space-y-1">
                <span className="text-purple-600 block text-[11px] font-bold">SHORTLISTED</span>
                <span className="text-lg font-extrabold text-purple-900">{analytics.applications.by_status.SHORTLISTED}</span>
              </div>

              <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 text-center space-y-1">
                <span className="text-amber-600 block text-[11px] font-bold">INTERVIEW</span>
                <span className="text-lg font-extrabold text-amber-900">{analytics.applications.by_status.INTERVIEW}</span>
              </div>

              <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 text-center space-y-1">
                <span className="text-emerald-600 block text-[11px] font-bold">HIRED</span>
                <span className="text-lg font-extrabold text-emerald-900">{analytics.applications.by_status.HIRED}</span>
              </div>

              <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-100 text-center space-y-1">
                <span className="text-rose-600 block text-[11px] font-bold">REJECTED</span>
                <span className="text-lg font-extrabold text-rose-900">{analytics.applications.by_status.REJECTED}</span>
              </div>
            </div>
          </div>

          {/* Top Skills & Active Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Top Skills */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Top Platform Skills</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {analytics.top_skills.map((item, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-bold flex items-center space-x-1.5">
                    <span>{item.skill}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 font-extrabold">
                      {item.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Most Active Companies */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Building className="w-4 h-4 text-blue-600" />
                <span>Most Active Hiring Companies</span>
              </h3>

              <div className="space-y-2 text-xs">
                {analytics.active_companies.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60 font-medium">
                    <span className="font-bold text-slate-900">{c.company}</span>
                    <span className="text-blue-600 font-bold">{c.count} Job Postings</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Registrations Feed */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Recent User Registrations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {analytics.recent_registrations.map((u) => (
                <div key={u.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{u.username}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] font-medium">{u.email}</p>
                  <span className="text-slate-400 text-[10px] block font-medium">{u.date_joined}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by username or email..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-700">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
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
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading platform user accounts...</span>
            </div>
          ) : usersList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8 font-medium">No users found matching search criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date Joined</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 font-bold text-slate-900">{u.username}</td>
                      <td className="py-3.5 text-slate-600">{u.email}</td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5">
                        {u.is_active ? (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-500">{u.date_joined}</td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                          className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${u.is_active
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">

          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Job Post Moderation Queue</span>
            </h3>

            <select
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Jobs</option>
              <option value="CLOSED">Closed / Moderated</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading job postings...</span>
            </div>
          ) : jobsList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8 font-medium">No job postings found.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {jobsList.map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${job.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                        {job.status}
                      </span>
                    </div>

                    <p className="text-slate-600 font-medium">
                      Company: <strong className="text-slate-900">{job.company}</strong> • Recruiter: {job.recruiter_email}
                    </p>
                    <p className="text-slate-400 text-[11px] font-medium">
                      Posted: {job.created_at} • Applicants: {job.applications_count}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {job.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleModerateJob(job.id, 'MODERATE')}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 font-bold"
                      >
                        Flag & Close
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModerateJob(job.id, 'APPROVE')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold"
                      >
                        Approve Active
                      </button>
                    )}

                    <button
                      onClick={() => handleModerateJob(job.id, 'DELETE')}
                      className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-colors"
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
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Platform-Wide Job Applications Oversight</span>
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-semibold">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading platform applications...</span>
            </div>
          ) : appsList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8 font-medium">No job applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Target Job & Company</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Applied At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {appsList.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5">
                        <span className="font-bold text-slate-900 block">{app.applicant_name}</span>
                        <span className="text-slate-500 text-[11px]">{app.applicant_email}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-slate-900 block">{app.job_title}</span>
                        <span className="text-slate-600 text-[11px]">{app.company}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-slate-500">{app.applied_at}</td>
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
