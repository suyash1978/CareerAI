import React from 'react';
import {
  X, Sparkles, CheckCircle2, AlertCircle, Award, Target, BookOpen,
  TrendingUp, ArrowRight, Check
} from 'lucide-react';

const JobMatchModal = ({ isOpen, onClose, job, matchData }) => {
  if (!isOpen || !job || !matchData) return null;

  const {
    match_score = 0,
    match_label = '',
    sub_scores = {},
    matching_skills = [],
    missing_skills = [],
    explanation = {}
  } = matchData;

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    if (score >= 70) return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
    if (score >= 55) return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6 transition-colors duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">AI Job Match Analysis</h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getScoreColor(match_score)}`}>
                  {match_score}% Match
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {job.title} at {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Rationale Summary Banner */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>MATCH ASSESSMENT SUMMARY ({match_label})</span>
          </div>
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">{explanation.summary}</p>
        </div>

        {/* Sub-Scores Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Skills Match</span>
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">{sub_scores.skills_score || 0} / 50</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((sub_scores.skills_score || 0) / 50) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>Experience</span>
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">{sub_scores.experience_score || 0} / 30</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((sub_scores.experience_score || 0) / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Education</span>
              </span>
              <span className="font-extrabold text-slate-900 dark:text-white">{sub_scores.education_score || 0} / 20</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
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
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Matching Competencies ({matching_skills.length})</span>
            </h4>

            {matching_skills.length === 0 ? (
              <p className="text-slate-500">No overlapping skills found yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {matching_skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing Skills */}
          <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Missing / Target Skills ({missing_skills.length})</span>
            </h4>

            {missing_skills.length === 0 ? (
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">You possess all required technical skills listed for this job!</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {missing_skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold">
                    + {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Rationale */}
        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>AI Match Score Optimization Tips</span>
          </h4>

          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
            {explanation.recommendations?.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
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
