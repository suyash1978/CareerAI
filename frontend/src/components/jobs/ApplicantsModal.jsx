import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Calendar, FileText, Loader2, UserCheck, ChevronRight, Sparkles, ShieldAlert, Trophy } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import ApplicantDetailModal from './ApplicantDetailModal';

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

const getScoreBadgeColor = (score) => {
  if (score >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (score >= 70) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  if (score >= 55) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return 'bg-slate-800 text-slate-300 border-slate-700';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-800 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Job Applicants</h2>
                <p className="text-xs text-slate-400">
                  {job.title} • <span className="text-purple-400 font-semibold">{applicants.length} Applicants</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* AI Rank Toggle Button */}
              <button
                onClick={() => setIsAiRanked(!isAiRanked)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isAiRanked
                    ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{isAiRanked ? 'AI Ranked Mode (ON)' : 'AI Rank Applicants'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI Assistive Rationale Disclaimer Banner */}
          {isAiRanked && (
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-indigo-400" />
              <span>
                <strong>Assistive AI Ranking:</strong> Rankings are calculated deterministically (Skills 50%, Experience 30%, Education 20%) to assist recruiter screening. AI does not make automated hiring decisions.
              </span>
            </div>
          )}

          {/* Applicants Stream */}
          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-400 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span>{isAiRanked ? 'Ranking candidate match scores...' : 'Loading job applicants...'}</span>
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">No Applicants Yet</h4>
              <p className="text-xs text-slate-500">Candidates who apply to this job will appear here.</p>
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
                    className="glass-card p-4 rounded-2xl border border-slate-800/80 hover:border-purple-500/40 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center space-x-3.5">
                      {isAiRanked && app.rank && (
                        <div className="flex-shrink-0 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-extrabold text-xs flex items-center space-x-1">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>#{app.rank}</span>
                        </div>
                      )}

                      <div className="p-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 group-hover:border-purple-500/50 transition-colors">
                        <UserCheck className="w-5 h-5 text-purple-400" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                            {seeker.full_name || app.applicant_name || app.applicant?.username || 'Job Candidate'}
                          </h4>

                          {matchScore !== undefined && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getScoreBadgeColor(matchScore)}`}>
                              {matchScore}% Match
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 flex items-center space-x-2">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          <span>{seeker.email || app.email || app.applicant?.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <div className="flex flex-col sm:items-end space-y-1">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${getStatusBadge(app.status)}`}>
                          {app.status_display || app.status?.replace('_', ' ')}
                        </span>

                        <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'Recent'}</span>
                        </span>
                      </div>

                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
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
