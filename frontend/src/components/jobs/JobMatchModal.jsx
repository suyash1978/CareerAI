import React from 'react';
import {
  X, Sparkles, CheckCircle2, AlertCircle, Award, Target, BookOpen,
  TrendingUp, ArrowRight, Building, Check, HelpCircle
} from 'lucide-react';

const JobMatchModal = ({ isOpen, onClose, job, matchData }) => {
  if (!isOpen || !job || !matchData) return null;

  const {
    match_score = 0,
    match_label = '',
    sub_scores = {},
    matching_skills = [],
    missing_skills = [],
    experience_match = '',
    education_match = '',
    explanation = {}
  } = matchData;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200/80 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6 text-slate-900">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-900">AI Job Match Analysis</h2>
                <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getScoreColor(match_score)}`}>
                  {match_score}% Match
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {job.title} at {job.company}
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

        {/* Score Rationale Summary Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-2 font-medium">
          <div className="flex items-center space-x-2 text-indigo-700 font-extrabold">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>MATCH ASSESSMENT SUMMARY ({match_label})</span>
          </div>
          <p className="leading-relaxed">{explanation.summary}</p>
        </div>

        {/* Sub-Scores Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                <span>Skills Match</span>
              </span>
              <span className="font-extrabold text-slate-900">{sub_scores.skills_score || 0} / 50</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((sub_scores.skills_score || 0) / 50) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                <span>Experience</span>
              </span>
              <span className="font-extrabold text-slate-900">{sub_scores.experience_score || 0} / 30</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((sub_scores.experience_score || 0) / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-600 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Education</span>
              </span>
              <span className="font-extrabold text-slate-900">{sub_scores.education_score || 0} / 20</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{ width: `${((sub_scores.education_score || 0) / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skills Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Matching Skills */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3">
            <h4 className="font-extrabold text-emerald-700 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Matching Competencies ({matching_skills.length})</span>
            </h4>

            {matching_skills.length === 0 ? (
              <p className="text-slate-500 font-medium">No overlapping skills found yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {matching_skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing Skills */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3">
            <h4 className="font-extrabold text-amber-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Missing / Target Skills ({missing_skills.length})</span>
            </h4>

            {missing_skills.length === 0 ? (
              <p className="text-emerald-700 font-bold">You possess all required technical skills listed for this job!</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {missing_skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold">
                    + {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Rationale */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3 text-xs">
          <h4 className="font-extrabold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>AI Match Score Optimization Tips</span>
          </h4>

          <ul className="space-y-2 text-slate-700 font-medium">
            {explanation.recommendations?.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default JobMatchModal;
