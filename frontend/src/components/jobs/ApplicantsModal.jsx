import React, { useState, useEffect } from 'react';
import { X, Users, Mail, Calendar, FileText, Loader2, UserCheck, ChevronRight, Sparkles, ShieldAlert, Trophy } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import ApplicantDetailModal from './ApplicantDetailModal';

const getStatusBadge = (status) => {
  switch (status) {
    case 'HIRED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'SHORTLISTED':
    case 'INTERVIEW':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'UNDER_REVIEW':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'REJECTED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200';
  }
};

const getScoreBadgeColor = (score) => {
  if (score >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 70) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (score >= 55) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
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
        <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200/80 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Job Applicants</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {job.title} • <span className="text-purple-600 font-bold">{applicants.length} Applicants</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* AI Rank Toggle Button */}
              <button
                onClick={() => setIsAiRanked(!isAiRanked)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isAiRanked
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-500/25'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Sparkles className={`w-4 h-4 ${isAiRanked ? 'text-white' : 'text-purple-600'}`} />
                <span>{isAiRanked ? 'AI Ranked Mode (ON)' : 'AI Rank Applicants'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AI Assistive Rationale Disclaimer Banner */}
          {isAiRanked && (
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800 flex items-center space-x-2 font-medium">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-indigo-600" />
              <span>
                <strong className="font-extrabold text-indigo-900">Assistive AI Ranking:</strong> Rankings are calculated deterministically (Skills 50%, Experience 30%, Education 20%) to assist recruiter screening. AI does not make automated hiring decisions.
              </span>
            </div>
          )}

          {/* Applicants Stream */}
          {loading ? (
            <div className="flex items-center justify-center py-12 space-x-2 text-slate-500 text-xs font-semibold">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span>{isAiRanked ? 'Ranking candidate match scores...' : 'Loading job applicants...'}</span>
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Users className="w-12 h-12 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No Applicants Yet</h4>
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
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 hover:border-purple-300 hover:shadow-md cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center space-x-3.5">
                      {isAiRanked && app.rank && (
                        <div className="flex-shrink-0 p-2 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 font-extrabold text-xs flex items-center space-x-1">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>#{app.rank}</span>
                        </div>
                      )}

                      <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-purple-600 flex items-center justify-center font-bold shadow-xs">
                        <UserCheck className="w-5 h-5 text-purple-600" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {seeker.full_name || app.applicant_name || app.applicant?.username || 'Job Candidate'}
                          </h4>

                          {matchScore !== undefined && (
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getScoreBadgeColor(matchScore)}`}>
                              {matchScore}% Match
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 font-medium flex items-center space-x-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span>{seeker.email || app.email || app.applicant?.email}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4">
                      <div className="flex flex-col sm:items-end space-y-1">
                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                          {app.status_display || app.status?.replace('_', ' ')}
                        </span>

                        <span className="text-[11px] text-slate-500 font-medium flex items-center space-x-1">
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
