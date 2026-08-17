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
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (score >= 70) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (score >= 55) return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-800 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">AI Job Match Analysis</h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${getScoreColor(match_score)}`}>
                  {match_score}% Match
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                {job.title} at {job.company}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Rationale Summary Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/30 border border-indigo-500/30 text-xs text-slate-200 space-y-2">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold">
            <Sparkles className="w-4 h-4" />
            <span>MATCH ASSESSMENT SUMMARY ({match_label})</span>
          </div>
          <p className="leading-relaxed">{explanation.summary}</p>
        </div>

        {/* Sub-Scores Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span>Skills Match</span>
              </span>
              <span className="font-bold text-white">{sub_scores.skills_score || 0} / 50</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${((sub_scores.skills_score || 0) / 50) * 100}%` }}
              />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span>Experience</span>
              </span>
              <span className="font-bold text-white">{sub_scores.experience_score || 0} / 30</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${((sub_scores.experience_score || 0) / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Education</span>
              </span>
              <span className="font-bold text-white">{sub_scores.education_score || 0} / 20</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${((sub_scores.education_score || 0) / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Skills Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Matching Skills */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Matching Competencies ({matching_skills.length})</span>
            </h4>

            {matching_skills.length === 0 ? (
              <p className="text-slate-500">No overlapping skills found yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {matching_skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center space-x-1">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Missing Skills */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-amber-400 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>Missing / Target Skills ({missing_skills.length})</span>
            </h4>

            {missing_skills.length === 0 ? (
              <p className="text-emerald-400 font-medium">You possess all required technical skills listed for this job!</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {missing_skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
                    + {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Rationale */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
          <h4 className="font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span>AI Match Score Optimization Tips</span>
          </h4>

          <ul className="space-y-2 text-slate-300">
            {explanation.recommendations?.map((rec, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
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
