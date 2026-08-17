import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Users, Briefcase, FileText, TrendingUp, Search,
  CheckCircle2, AlertCircle, Trash2, RefreshCw, Loader2,
  Building, Award, Activity, ShieldAlert
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
    <div className="space-y-8 py-4 transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Platform Admin Control Center</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time platform analytics, user moderation, job post oversight, and application metrics
              </p>
            </div>
          </div>

          <button
            onClick={() => { fetchAnalytics(); if (activeTab === 'USERS') fetchUsers(); if (activeTab === 'JOBS') fetchJobs(); }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all self-start md:self-auto"
          >
            <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Refresh Analytics</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-6 text-xs font-bold overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('ANALYTICS')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'ANALYTICS'
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Analytics & Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('USERS')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'USERS'
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Management</span>
        </button>

        <button
          onClick={() => setActiveTab('JOBS')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'JOBS'
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Post Moderation</span>
        </button>

        <button
          onClick={() => setActiveTab('APPLICATIONS')}
          className={`pb-3 px-2 flex items-center space-x-2 transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'APPLICATIONS'
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
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
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Total Users</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{analytics.users.total}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">
                {analytics.users.seekers} Seekers • {analytics.users.recruiters} Recruiters
              </span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Active Job Postings</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{analytics.jobs.active}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">Out of {analytics.jobs.total} total jobs</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Total Applications</span>
              <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{analytics.applications.total}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">Submitted platform-wide</span>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block">Hired Candidates</span>
              <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                {analytics.applications.by_status.HIRED || 0}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold">Successful matches</span>
            </div>
          </div>

          {/* Application Status Funnel */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Application Pipeline Distribution</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">APPLIED</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{analytics.applications.by_status.APPLIED}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">UNDER REVIEW</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{analytics.applications.by_status.UNDER_REVIEW}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">SHORTLISTED</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{analytics.applications.by_status.SHORTLISTED}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">INTERVIEW</span>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{analytics.applications.by_status.INTERVIEW}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">HIRED</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{analytics.applications.by_status.HIRED}</span>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">REJECTED</span>
                <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{analytics.applications.by_status.REJECTED}</span>
              </div>
            </div>
          </div>

          {/* Top Skills & Active Companies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Skills */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Top Platform Skills</span>
              </h3>

              <div className="flex flex-wrap gap-2">
                {analytics.top_skills.map((item, idx) => (
                  <span key={idx} className="text-xs px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold flex items-center space-x-1.5">
                    <span>{item.skill}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200">
                      {item.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Most Active Companies */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Most Active Hiring Companies</span>
              </h3>

              <div className="space-y-2 text-xs">
                {analytics.active_companies.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white">{c.company}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{c.count} Job Postings</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Recent Registrations Feed */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Recent User Registrations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {analytics.recent_registrations.map((u) => (
                <div key={u.id} className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{u.username}</span>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {u.role}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{u.email}</p>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px] block font-semibold">{u.date_joined}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'USERS' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users by username or email..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
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
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading platform user accounts...</span>
            </div>
          ) : usersList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No users found matching search criteria.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="pb-3">User</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date Joined</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">{u.username}</td>
                      <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{u.email}</td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        {u.is_active ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">{u.date_joined}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.is_active)}
                          className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                            u.is_active
                              ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 border border-rose-200 dark:border-rose-800'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800'
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
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Job Post Moderation Queue</span>
            </h3>

            <select
              value={jobStatusFilter}
              onChange={(e) => setJobStatusFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active Jobs</option>
              <option value="CLOSED">Closed / Moderated</option>
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading job postings...</span>
            </div>
          ) : jobsList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No job postings found.</p>
          ) : (
            <div className="space-y-3 text-xs">
              {jobsList.map((job) => (
                <div key={job.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{job.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        job.status === 'ACTIVE'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Company: <strong className="text-slate-900 dark:text-slate-200">{job.company}</strong> • Recruiter: {job.recruiter_email}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
                      Posted: {job.created_at} • Applicants: {job.applications_count}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {job.status === 'ACTIVE' ? (
                      <button
                        onClick={() => handleModerateJob(job.id, 'MODERATE')}
                        className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold"
                      >
                        Flag & Close
                      </button>
                    ) : (
                      <button
                        onClick={() => handleModerateJob(job.id, 'APPROVE')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold"
                      >
                        Approve Active
                      </button>
                    )}

                    <button
                      onClick={() => handleModerateJob(job.id, 'DELETE')}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 transition-colors"
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
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Platform-Wide Job Applications Oversight</span>
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading platform applications...</span>
            </div>
          ) : appsList.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No job applications submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Target Job & Company</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Applied At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {appsList.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/40">
                      <td className="py-3">
                        <span className="font-bold text-slate-900 dark:text-white block">{app.applicant_name}</span>
                        <span className="text-slate-500 text-[11px] font-medium">{app.applicant_email}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{app.job_title}</span>
                        <span className="text-slate-500 text-[11px] font-medium">{app.company}</span>
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 dark:text-slate-400 font-medium">{app.applied_at}</td>
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
