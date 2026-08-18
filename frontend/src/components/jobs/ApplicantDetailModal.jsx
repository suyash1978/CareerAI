import React, { useState, useEffect } from 'react';
import {
  X, UserCheck, Mail, Phone, MapPin, GraduationCap, Code, Briefcase,
  Linkedin, Github, Download, CheckCircle2, Save, Loader2, FileText, Sparkles, Target, Award, ShieldAlert
} from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import { getMediaUrl } from '../../utils/constants';

const STATUS_OPTIONS = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'SHORTLISTED', label: 'Shortlisted' },
  { value: 'INTERVIEW', label: 'Interview Scheduled' },
  { value: 'HIRED', label: 'Hired' },
  { value: 'REJECTED', label: 'Rejected' },
];

const ApplicantDetailModal = ({ isOpen, onClose, application, onStatusUpdated }) => {
  const [status, setStatus] = useState('APPLIED');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (application) {
      setStatus(application.status || 'APPLIED');
      setRecruiterNotes(application.recruiter_notes || '');
      setSuccessMsg('');
    }
  }, [application, isOpen]);

  if (!isOpen || !application) return null;

  const profile = application.applicant_profile || application.candidate_profile || {};
  const matchScore = application.match_score;
  const subScores = application.sub_scores || {};
  const matchingSkills = application.matching_skills || [];
  const missingSkills = application.missing_skills || [];
  const summary = application.candidate_summary;
  const resumeUrl = getMediaUrl(application.resume_file || application.resume);

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 border-emerald-200 bg-emerald-50';
    if (score >= 70) return 'text-blue-700 border-blue-200 bg-blue-50';
    if (score >= 55) return 'text-amber-700 border-amber-200 bg-amber-50';
    return 'text-rose-700 border-rose-200 bg-rose-50';
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    const appId = application.id || application.application_id;

    try {
      await jobApi.updateApplicationStatus(appId, {
        status,
        recruiter_notes: recruiterNotes,
      });
      setSuccessMsg('Candidate status and recruiter notes saved!');
      if (onStatusUpdated) onStatusUpdated();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update application status', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200/80 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 flex items-center justify-center font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-900">
                  {profile.full_name || application.applicant_name || application.applicant?.username || 'Candidate Profile'}
                </h2>

                {matchScore !== undefined && (
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getScoreColor(matchScore)}`}>
                    {matchScore}% Match
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Applied for {application.job_title || application.job?.title || 'Position'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Candidate Qualification Summary */}
        {summary && (
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-1 font-medium">
            <div className="flex items-center space-x-2 text-indigo-700 font-extrabold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>AI CANDIDATE QUALIFICATION SUMMARY</span>
            </div>
            <p className="leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Deterministic Scoring Breakdown */}
        {subScores.skills_score !== undefined && (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Deterministic Scoring Rationale</span>
              </h4>

              <span className="text-[11px] text-slate-500 font-bold">
                Empirical Weighted Criteria
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 shadow-xs">
                <span className="text-slate-500 block font-medium">Skills Score</span>
                <span className="text-sm font-extrabold text-blue-600">{subScores.skills_score} / 50</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 shadow-xs">
                <span className="text-slate-500 block font-medium">Experience Score</span>
                <span className="text-sm font-extrabold text-purple-600">{subScores.experience_score} / 30</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1 shadow-xs">
                <span className="text-slate-500 block font-medium">Education Score</span>
                <span className="text-sm font-extrabold text-emerald-600">{subScores.education_score} / 20</span>
              </div>
            </div>

            {/* Matching vs Missing Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {matchingSkills.length > 0 && (
                <div>
                  <span className="text-emerald-700 font-bold block mb-1">Matching Job Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {matchingSkills.map((s, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {missingSkills.length > 0 && (
                <div>
                  <span className="text-amber-700 font-bold block mb-1">Missing Target Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {missingSkills.map((s, idx) => (
                      <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Candidate Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Contact Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3 font-medium">
            <h4 className="font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200/60 pb-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Contact Information</span>
            </h4>

            <div className="space-y-2 text-slate-700">
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.email || application.email || application.applicant?.email}</span>
              </p>

              {profile.phone && (
                <p className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.phone}</span>
                </p>
              )}

              {profile.location && (
                <p className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.location}</span>
                </p>
              )}
            </div>
          </div>

          {/* Education & Experience */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-3 font-medium">
            <h4 className="font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-200/60 pb-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <span>Education & Seniority</span>
            </h4>

            <div className="space-y-2 text-slate-700">
              <p><strong className="text-slate-900 font-bold">Education:</strong> {profile.education || 'Not specified'}</p>
              <p><strong className="text-slate-900 font-bold">Experience Summary:</strong> {profile.experience || 'Not specified'}</p>
            </div>
          </div>

        </div>

        {/* Resume Download Action */}
        {resumeUrl && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Submitted PDF Resume</span>
                <span className="text-[11px] text-slate-500 font-medium">PDF Document</span>
              </div>
            </div>

            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/25"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume PDF</span>
            </a>
          </div>
        )}

        {/* Status & Recruiter Notes Form */}
        <form onSubmit={handleSaveStatus} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <h4 className="font-extrabold text-slate-900 text-xs">Recruiter Decision & Evaluation Notes</h4>
            {successMsg && (
              <span className="text-xs text-emerald-700 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{successMsg}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">Candidate Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 block">Recruiter Evaluation Notes</label>
              <input
                type="text"
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                placeholder="Add confidential notes on interview feedback, technical assessment, or salary expectations..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-500/25 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Status & Notes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ApplicantDetailModal;
