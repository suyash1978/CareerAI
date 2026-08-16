import React, { useState, useEffect } from 'react';
import {
  Sparkles, Building, MapPin, Briefcase, DollarSign, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight, Send, Eye, Loader2, AlertCircle, Award, Target
} from 'lucide-react';
import { jobApi } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';
import JobMatchModal from '../components/jobs/JobMatchModal';
import ApplyModal from '../components/jobs/ApplyModal';

const RecommendedJobs = () => {
  const { isAuthenticated, role } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Selected Job for Match Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedMatchData, setSelectedMatchData] = useState(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  // Selected Job for Apply Modal
  const [jobToApply, setJobToApply] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await jobApi.getRecommendedJobs();
      const list = data.results || data || [];
      setJobs(list);
    } catch (err) {
      console.error('Failed to fetch recommended jobs', err);
      setError('Failed to calculate job recommendations. Please check profile skills and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMatchDetails = (job) => {
    setSelectedJob(job);
    setSelectedMatchData(job.match_details);
    setIsMatchModalOpen(true);
  };

  const handleOpenApplyModal = (job, e) => {
    if (e) e.stopPropagation();
    if (role === 'RECRUITER') {
      alert('Recruiters cannot submit job applications.');
      return;
    }
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  const handleToggleSave = async (jobId, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await jobApi.saveJob(jobId);
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === jobId ? { ...j, is_saved: res.saved } : j))
      );
    } catch (err) {
      console.error('Failed to save job', err);
    }
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (score >= 70) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (score >= 55) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">AI Job Recommendations</h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  Smart Match Algorithm
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Jobs matched deterministically against your profile skills, experience level, and uploaded PDF resumes
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchRecommendations} className="underline font-semibold">
            Retry
          </button>
        </div>
      )}

      {/* Main Jobs Stream */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 rounded-3xl animate-pulse space-y-3">
              <div className="h-5 bg-slate-800 rounded w-1/3" />
              <div className="h-4 bg-slate-800/60 rounded w-1/4" />
              <div className="h-12 bg-slate-900 rounded w-full" />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Recommendations Available</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Add skills to your Job Seeker profile or upload a PDF resume to generate tailored job match scores.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const match = job.match_details || {};
            const score = match.match_score || 0;

            return (
              <div
                key={job.id}
                onClick={() => handleOpenMatchDetails(job)}
                className="glass-card p-6 rounded-3xl border border-slate-800/80 hover:border-purple-500/40 cursor-pointer transition-all space-y-4 group relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-400 group-hover:scale-105 transition-transform">
                      <Building className="w-6 h-6" />
                    </div>

                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {job.title}
                        </h3>

                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getScoreBadgeColor(score)} flex items-center space-x-1`}>
                          <Sparkles className="w-3 h-3" />
                          <span>{score}% Match</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-semibold mt-0.5">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleToggleSave(job.id, e)}
                      className={`p-2 rounded-xl border transition-all ${
                        job.is_saved
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title={job.is_saved ? 'Remove Bookmark' : 'Save Job'}
                    >
                      {job.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{job.location}</span>
                  </span>

                  <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{job.job_type}</span>
                  </span>

                  {job.salary_min && (
                    <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}/yr</span>
                    </span>
                  )}
                </div>

                {/* Matching Skills Pills */}
                {match.matching_skills && match.matching_skills.length > 0 && (
                  <div className="flex items-center space-x-2 text-xs pt-1">
                    <span className="text-slate-400 font-semibold flex-shrink-0">Matching Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {match.matching_skills.map((skill, sIdx) => (
                        <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/60">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleOpenMatchDetails(job); }}
                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full AI Match Analysis →</span>
                  </button>

                  <button
                    disabled={job.has_applied}
                    onClick={(e) => handleOpenApplyModal(job, e)}
                    className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      job.has_applied
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{job.has_applied ? 'Applied' : 'Apply Now'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <JobMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        job={selectedJob}
        matchData={selectedMatchData}
      />

      <ApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={jobToApply}
        onAppliedSuccess={() => fetchRecommendations()}
      />

    </div>
  );
};

export default RecommendedJobs;
