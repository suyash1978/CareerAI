import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Briefcase, DollarSign, Filter, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight, X, Clock, Calendar, CheckCircle2, AlertCircle,
  Loader2, Sparkles, Building, Layers, Send
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
    <div className="space-y-8 py-4">

      {/* Header & Tab Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Tech Jobs</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Browse active career opportunities matched to your skills
          </p>
        </div>

        {isAuthenticated && (
          <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 inline-flex space-x-1 self-start md:self-auto">
            <button
              onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Active Jobs ({activeTab === 'all' ? totalCount : '...'})
            </button>

            <button
              onClick={() => { setActiveTab('saved'); setCurrentPage(1); }}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'saved'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-600 hover:text-slate-900'
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
        <aside className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filter Jobs</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-[11px] text-slate-500 hover:text-blue-600 font-bold"
            >
              Reset
            </button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Keywords / Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="React, Engineer..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="San Francisco, Remote..."
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Job Type</label>
              <select
                name="job_type"
                value={filters.job_type}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
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
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Experience Level</label>
              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                <option value="">All Experience Levels</option>
                <option value="ENTRY">Entry Level (0-2 yrs)</option>
                <option value="MID">Mid Level (2-5 yrs)</option>
                <option value="SENIOR">Senior Level (5+ yrs)</option>
                <option value="LEAD">Lead / Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Skills</label>
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={handleFilterChange}
                placeholder="Django, Python, AWS..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Min Salary ($ USD/yr)</label>
              <div className="relative">
                <DollarSign className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="number"
                  name="min_salary"
                  value={filters.min_salary}
                  onChange={handleFilterChange}
                  placeholder="80000"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/25 transition-all"
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Job Listings Stream */}
        <main className="lg:col-span-3 space-y-6">

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
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
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 animate-pulse space-y-3">
                  <div className="h-5 bg-slate-100 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                  <div className="h-12 bg-slate-50 rounded w-full" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-md">
              <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-extrabold text-slate-900">
                {activeTab === 'saved' ? 'No Saved Jobs' : 'No Jobs Match Your Filters'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                {activeTab === 'saved'
                  ? 'You have not saved any jobs yet. Bookmark jobs while browsing to save them for later review.'
                  : 'Try clearing your filters or searching for different keywords.'}
              </p>
              {activeTab === 'all' && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors mt-2"
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
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md hover:shadow-xl hover:border-blue-300 cursor-pointer transition-all space-y-4 group relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                        <Building className="w-6 h-6" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          {job.has_applied && (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Applied
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-bold mt-0.5">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isAuthenticated && (
                        <button
                          onClick={(e) => handleToggleSave(job.id, e)}
                          className={`p-2.5 rounded-xl border transition-all ${job.is_saved
                              ? 'bg-blue-50 border-blue-200 text-blue-600'
                              : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
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
                          className={`hidden sm:inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${job.has_applied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25'
                            }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{job.has_applied ? 'Applied' : 'Quick Apply'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{job.location}</span>
                    </span>

                    <span className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{job.job_type}</span>
                    </span>

                    <span className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 font-bold">
                      <Layers className="w-3.5 h-3.5 text-purple-600" />
                      <span>{job.experience_required}</span>
                    </span>

                    {job.salary_min && (
                      <span className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}/yr</span>
                      </span>
                    )}
                  </div>

                  {/* Skills Pills */}
                  {job.skills_required && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills_required.split(',').slice(0, 5).map((skill, sIdx) => (
                        <span key={sIdx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                    </span>

                    <span className="text-blue-600 font-bold group-hover:underline">
                      View Details & Apply →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium">
                Page {currentPage} of {totalPages} ({totalCount} total jobs)
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-xs"
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
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200/80 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6 text-slate-900">

            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md flex items-center justify-center">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedJob.title}</h2>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{selectedJob.company}</p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700">
                📍 {selectedJob.location}
              </span>
              <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                💼 {selectedJob.job_type}
              </span>
              <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700">
                🎯 {selectedJob.experience_required}
              </span>
              {selectedJob.salary_min && (
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700">
                  💰 ${Number(selectedJob.salary_min).toLocaleString()} - ${Number(selectedJob.salary_max).toLocaleString()}/yr
                </span>
              )}
            </div>

            {/* Description & Requirements */}
            <div className="space-y-4 text-xs max-h-[400px] overflow-y-auto pr-2">
              <div>
                <h4 className="font-extrabold text-slate-900 mb-1">Job Description</h4>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">{selectedJob.description}</p>
              </div>

              {selectedJob.responsibilities && (
                <div>
                  <h4 className="font-extrabold text-slate-900 mb-1">Key Responsibilities</h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">{selectedJob.responsibilities}</p>
                </div>
              )}

              {selectedJob.qualifications && (
                <div>
                  <h4 className="font-extrabold text-slate-900 mb-1">Qualifications & Requirements</h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line font-medium">{selectedJob.qualifications}</p>
                </div>
              )}

              {selectedJob.skills_required && (
                <div>
                  <h4 className="font-extrabold text-slate-900 mb-1">Required Skills</h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedJob.skills_required.split(',').map((skill, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              {isAuthenticated && (
                <button
                  onClick={(e) => handleToggleSave(selectedJob.id, e)}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${selectedJob.is_saved
                      ? 'bg-blue-50 border-blue-200 text-blue-600'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
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
                  className={`inline-flex items-center space-x-2 text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all ${selectedJob.has_applied
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
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
