import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Briefcase, DollarSign, Filter, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight, X, Clock, AlertCircle, Layers, Send, Building
} from 'lucide-react';
import { jobApi } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';
import ApplyModal from '../components/jobs/ApplyModal';

const Jobs = () => {
  const { isAuthenticated, role } = useAuth();

  // Active Tab: 'all' | 'saved'
  const [activeTab, setActiveTab] = useState('all');

  // Listings & Pagination State
  const [jobs, setJobs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter State
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    job_type: '',
    experience: '',
    skills: '',
    min_salary: '',
  });

  // Selected Job for Details Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, activeTab]);

  const fetchJobs = async (page = 1, customFilters = filters) => {
    setLoading(true);
    setError('');

    try {
      if (activeTab === 'saved') {
        const data = await jobApi.getSavedJobs({ page });
        const savedList = data.results || data || [];
        setJobs(savedList.map((item) => item.job_details || item.job));
        setTotalCount(data.count || savedList.length);
        setTotalPages(Math.ceil((data.count || savedList.length) / 10) || 1);
      } else {
        const params = {
          page,
          ...(customFilters.search && { search: customFilters.search }),
          ...(customFilters.location && { location: customFilters.location }),
          ...(customFilters.job_type && { job_type: customFilters.job_type }),
          ...(customFilters.experience && { experience: customFilters.experience }),
          ...(customFilters.skills && { skills: customFilters.skills }),
          ...(customFilters.min_salary && { min_salary: customFilters.min_salary }),
        };

        const data = await jobApi.getJobs(params);
        setJobs(data.results || data || []);
        setTotalCount(data.count || (data.results || data || []).length);
        setTotalPages(Math.ceil((data.count || (data.results || data || []).length) / 10) || 1);
      }
    } catch (err) {
      console.error('Failed to fetch jobs', err);
      setError('Failed to load job listings. Please check connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs(1, filters);
  };

  const handleClearFilters = () => {
    const resetFilters = {
      search: '',
      location: '',
      job_type: '',
      experience: '',
      skills: '',
      min_salary: '',
    };
    setFilters(resetFilters);
    setCurrentPage(1);
    fetchJobs(1, resetFilters);
  };

  const handleToggleSave = async (jobId, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to save jobs.');
      return;
    }

    try {
      const res = await jobApi.saveJob(jobId);
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === jobId ? { ...j, is_saved: res.saved } : j))
      );
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob((prev) => ({ ...prev, is_saved: res.saved }));
      }
    } catch (err) {
      console.error('Failed to save job', err);
    }
  };

  const handleOpenDetails = (job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleOpenApplyModal = (job, e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in as a Job Seeker to submit an application.');
      return;
    }
    if (role === 'RECRUITER') {
      alert('Recruiter accounts cannot apply for jobs. Please log in with a Job Seeker account.');
      return;
    }
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const handleAppliedSuccess = (jobId) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, has_applied: true } : j))
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => ({ ...prev, has_applied: true }));
    }
  };

  return (
    <div className="space-y-8 py-4 transition-colors duration-200">
      
      {/* Header & Tab Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore Active Tech Jobs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse opportunities matched to your technical stack and career goals
          </p>
        </div>

        {isAuthenticated && (
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
            <button
              onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Active Jobs ({activeTab === 'all' ? totalCount : '...'})
            </button>

            <button
              onClick={() => { setActiveTab('saved'); setCurrentPage(1); }}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'saved'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Jobs</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Layout Grid: Filters Sidebar + Jobs Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filter Sidebar */}
        <aside className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6 h-fit shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Filter Jobs</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold"
            >
              Reset
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Keywords / Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="React, Engineer..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="San Francisco, Remote..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Job Type</label>
              <select
                name="job_type"
                value={filters.job_type}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="">All Job Types</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="REMOTE">Remote</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Experience Level</label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="">All Experience Levels</option>
                <option value="ENTRY">Entry Level (0-2 yrs)</option>
                <option value="MID">Mid Level (2-5 yrs)</option>
                <option value="SENIOR">Senior Level (5+ yrs)</option>
                <option value="LEAD">Lead / Executive</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Skills</label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                placeholder="Django, Python, AWS..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Min Salary ($ USD/yr)</label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                <input
                  type="number"
                  name="min_salary"
                  value={filters.min_salary}
                  onChange={handleFilterChange}
                  placeholder="80000"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-sm transition-all"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Job Listings Stream */}
        <main className="lg:col-span-3 space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => fetchJobs(currentPage)} className="underline font-bold">
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-1/4" />
                  <div className="h-12 bg-slate-50 dark:bg-slate-950 rounded w-full" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-sm">
              <Briefcase className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeTab === 'saved' ? 'No Saved Jobs' : 'No Jobs Match Your Filters'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {activeTab === 'saved'
                  ? 'You have not saved any jobs yet. Bookmark jobs while browsing to save them for later review.'
                  : 'Try clearing your filters or searching for different keywords.'}
              </p>
              {activeTab === 'all' && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold transition-colors mt-2"
                >
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleOpenDetails(job)}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-4 group relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                        <Building className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {job.title}
                          </h3>
                          {job.has_applied && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              Applied
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isAuthenticated && (
                        <button
                          onClick={(e) => handleToggleSave(job.id, e)}
                          className={`p-2 rounded-xl border transition-all ${
                            job.is_saved
                              ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white'
                          }`}
                          title={job.is_saved ? 'Remove Bookmark' : 'Save Job'}
                        >
                          {job.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                      )}

                      {role !== 'RECRUITER' && (
                        <button
                          disabled={job.has_applied}
                          onClick={(e) => handleOpenApplyModal(job, e)}
                          className={`hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            job.has_applied
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{job.has_applied ? 'Applied' : 'Quick Apply'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{job.location}</span>
                    </span>

                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-300">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{job.job_type}</span>
                    </span>

                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-purple-700 dark:text-purple-300">
                      <Layers className="w-3.5 h-3.5 text-purple-500" />
                      <span>{job.experience_required}</span>
                    </span>

                    {job.salary_min && (
                      <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}/yr</span>
                      </span>
                    )}
                  </div>

                  {/* Skills Pills */}
                  {job.skills_required && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills_required.split(',').slice(0, 5).map((skill, sIdx) => (
                        <span key={sIdx} className="text-[11px] px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 font-medium">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    </span>

                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline">
                      View Details & Apply →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages} ({totalCount} total jobs)
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Job Details Modal / Drawer */}
      {isDetailsOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6 transition-colors duration-200">
            
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{selectedJob.title}</h2>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">{selectedJob.company}</p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                📍 {selectedJob.location}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-300">
                💼 {selectedJob.job_type}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-purple-700 dark:text-purple-300">
                🎯 {selectedJob.experience_required}
              </span>
              {selectedJob.salary_min && (
                <span className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold">
                  💰 ${Number(selectedJob.salary_min).toLocaleString()} - ${Number(selectedJob.salary_max).toLocaleString()}/yr
                </span>
              )}
            </div>

            {/* Description & Requirements */}
            <div className="space-y-4 text-xs max-h-[400px] overflow-y-auto pr-2">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Job Description</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
              </div>

              {selectedJob.responsibilities && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Key Responsibilities</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selectedJob.responsibilities}</p>
                </div>
              )}

              {selectedJob.qualifications && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Qualifications & Requirements</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{selectedJob.qualifications}</p>
                </div>
              )}

              {selectedJob.skills_required && (
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedJob.skills_required.split(',').map((skill, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              {isAuthenticated && (
                <button
                  onClick={(e) => handleToggleSave(selectedJob.id, e)}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    selectedJob.is_saved
                      ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>{selectedJob.is_saved ? 'Saved in Bookmarks' : 'Save Job'}</span>
                </button>
              )}

              {role !== 'RECRUITER' && (
                <button
                  disabled={selectedJob.has_applied}
                  onClick={(e) => {
                    setIsDetailsOpen(false);
                    handleOpenApplyModal(selectedJob, e);
                  }}
                  className={`inline-flex items-center space-x-2 text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all ${
                    selectedJob.has_applied
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{selectedJob.has_applied ? 'Application Submitted' : 'Apply For Position'}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Apply Modal */}
      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={jobToApply}
        onAppliedSuccess={handleAppliedSuccess}
      />

    </div>
  );
};

export default Jobs;
