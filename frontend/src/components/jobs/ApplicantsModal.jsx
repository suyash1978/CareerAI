import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Calendar, Loader2, UserCheck, ChevronRight, Sparkles, ShieldAlert, Trophy } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import ApplicantDetailModal from './ApplicantDetailModal';

const getStatusBadge = (status) => {
  switch (status) {
    case 'HIRED':
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    case 'SHORTLISTED':
    case 'INTERVIEW':
      return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    case 'UNDER_REVIEW':
      return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    case 'REJECTED':
      return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
    default:
      return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  }
};

const getScoreBadgeColor = (score) => {
  if (score >= 85) return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
  if (score >= 70) return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
  if (score >= 55) return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
  return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
};

const ApplicantsModal = ({ isOpen, onClose, job }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAiRanked, setIsAiRanked] = useState(false);
  const [disclaimer, setDisclaimer] = useState('');

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && job) {
      if (isAiRanked) {
        fetchRankedApplicants();
      } else {
        fetchApplicants();
      }
    }
  }, [isOpen, job, isAiRanked]);

  const fetchApplicants = () => {
    setLoading(true);
    jobApi.getApplicants(job.id)
      .then((data) => setApplicants(data.results || data || []))
      .catch((err) => console.error('Failed to fetch applicants', err))
      .finally(() => setLoading(false));
  };

  const fetchRankedApplicants = () => {
    setLoading(true);
    jobApi.getRankedApplicants(job.id)
      .then((data) => {
        setApplicants(data.applicants || []);
        setDisclaimer(data.disclaimer || '');
      })
      .catch((err) => console.error('Failed to fetch AI ranked applicants', err))
      .finally(() => setLoading(false));
  };

  const handleOpenDetail = (app) => {
    setSelectedApplication(app);
    setIsDetailModalOpen(true);
  };

  if (!isOpen || !job) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6 transition-colors duration-200">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Job Applicants</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {job.title} • <span className="text-purple-600 dark:text-purple-400 font-bold">{applicants.length} Applicants</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* AI Rank Toggle Button */}
              <button
                onClick={() => setIsAiRanked(!isAiRanked)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isAiRanked
                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{isAiRanked ? 'AI Ranked Mode (ON)' : 'AI Rank Applicants'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI Assistive Rationale Disclaimer Banner */}
          {isAiRanked && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300 flex items-center space-x-2 font-medium">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>
                <strong>Assistive AI Ranking:</strong> Rankings are calculated deterministically (Skills 50%, Experience 30%, Education 20%) to assist recruiter screening. AI does not make automated hiring decisions.
              </span>
            </div>
          )}

          {/* Applicants Stream */}
          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-medium">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span>{isAiRanked ? 'Ranking candidate match scores...' : 'Loading job applicants...'}</span>
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Users className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Applicants Yet</h4>
              <p className="text-xs text-slate-500 font-medium">Candidates who apply to this job will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {applicants.map((app, index) => {
                const seeker = app.candidate_profile || app;
                const matchScore = app.match_score;

                return (
                  <div
                    key={app.id || app.application_id || index}
                    onClick={() => handleOpenDetail(app)}
                    className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
                  >
                    <div className="flex items-center space-x-3.5">
                      {isAiRanked && app.rank && (
                        <div className="flex-shrink-0 p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 font-extrabold text-xs flex items-center space-x-1">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>#{app.rank}</span>
                        </div>
                      )}

                      <div className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 group-hover:border-purple-500 transition-colors">
                        <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                            {seeker.full_name || app.applicant_name || app.applicant?.username || 'Job Candidate'}
                          </h4>

                          {matchScore !== undefined && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getScoreBadgeColor(matchScore)}`}>
                              {matchScore}% Match
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2 font-medium">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{seeker.email || app.email || app.applicant?.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <div className="flex flex-col sm:items-end space-y-1">
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border ${getStatusBadge(app.status)}`}>
                          {app.status_display || app.status?.replace('_', ' ')}
                        </span>

                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center space-x-1 font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Recent'}</span>
                        </span>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      <ApplicantDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        application={selectedApplication}
        onStatusUpdated={() => {
          if (isAiRanked) fetchRankedApplicants();
          else fetchApplicants();
        }}
      />
    </>
  );
};

export default ApplicantsModal;
