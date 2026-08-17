import React, { useState, useEffect } from 'react';
import {
  FileText, Sparkles, CheckCircle2, AlertCircle, Award, Target,
  TrendingUp, ArrowRight, ShieldAlert, Loader2, Check
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { resumeApi } from '../api/resumeApi';
import { useAuth } from '../context/AuthContext';

const ResumeAnalyzer = () => {
  const { user } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumesAndAnalyze();
  }, []);

  const fetchResumesAndAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      const resList = await resumeApi.getResumes();
      const list = resList.results || resList || [];
      setResumes(list);

      let targetId = selectedResumeId;
      if (!targetId && list.length > 0) {
        const primary = list.find((r) => r.is_primary) || list[0];
        targetId = primary.id;
        setSelectedResumeId(primary.id);
      }

      if (targetId) {
        const result = await aiApi.analyzeResume({ resume_id: targetId });
        setAnalysis(result);
      } else {
        setError('No uploaded PDF resumes found. Please upload a resume first in the Job Seeker Dashboard.');
      }
    } catch (err) {
      console.error('Failed to run resume analysis', err);
      setError(err.response?.data?.error || 'Failed to analyze resume. Ensure a PDF resume is uploaded.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResume = async (e) => {
    const rId = e.target.value;
    setSelectedResumeId(rId);
    if (!rId) return;

    setLoading(true);
    setError('');
    try {
      const result = await aiApi.analyzeResume({ resume_id: rId });
      setAnalysis(result);
    } catch (err) {
      console.error('Failed to analyze selected resume', err);
      setError(err.response?.data?.error || 'Failed to analyze selected resume.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 70) return 'text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40';
    if (score >= 50) return 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40';
    return 'text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40';
  };

  return (
    <div className="space-y-8 py-4 transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Resume Analyzer</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800 uppercase tracking-wider">
                  ATS & Impact Auditor
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Deterministic section audit, empirical score calculation, ATS compliance tips, and metric-driven bullet point rewrites
              </p>
            </div>
          </div>

          {/* Resume Dropdown Selector */}
          {resumes.length > 0 && (
            <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <select
                value={selectedResumeId}
                onChange={handleSelectResume}
                className="bg-transparent text-slate-900 dark:text-slate-200 text-xs font-bold focus:outline-none pr-2"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.is_primary ? 'Primary' : 'Resume'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchResumesAndAnalyze} className="underline font-bold">
            Retry Analysis
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Auditing resume structure, contact completeness, and action verbs...</span>
        </div>
      ) : !analysis ? null : (
        <div className="space-y-8">
          
          {/* Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <span className="font-bold text-amber-900 dark:text-amber-400 block mb-0.5">ATS ANALYSIS DISCLAIMER</span>
              <p className="leading-relaxed">{analysis.disclaimer}</p>
            </div>
          </div>

          {/* Top Score Banner */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            {/* Score Gauge */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Resume Quality Score</span>
              <div className={`text-4xl font-extrabold px-5 py-2.5 rounded-2xl border ${getScoreColor(analysis.resume_score)}`}>
                {analysis.resume_score} / 100
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                Deterministic Audit Score
              </span>
            </div>

            {/* Sub-Checks Breakdown */}
            <div className="md:col-span-3 space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Empirical Structural Audit Breakdown</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[11px]">Contact Info Completeness</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {analysis.deterministic_checks.contact_completeness.score} / 30 pts
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[11px]">Core Sections Audit</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {analysis.deterministic_checks.section_audit.score} / 50 pts
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[11px]">Action Verbs & Impact</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {analysis.deterministic_checks.content_metrics.score} / 20 pts
                  </span>
                </div>
              </div>

              {analysis.deterministic_checks.missing_sections.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Missing Recommended Sections: <strong>{analysis.deterministic_checks.missing_sections.join(', ')}</strong>
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Strengths */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>Identified Strengths</span>
              </h3>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysis.ai_suggestions.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Areas for Improvement */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <AlertCircle className="w-4.5 h-4.5" />
                <span>Areas for Improvement</span>
              </h3>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {analysis.ai_suggestions.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Skills to Highlight */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Target className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              <span>Recommended Skills to Highlight on Resume</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {analysis.ai_suggestions.skills_to_highlight.map((skill, idx) => (
                <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold">
                  ★ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* ATS Compatibility Tips */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>ATS Compatibility Recommendations</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {analysis.ai_suggestions.ats_compatibility_tips.map((tip, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3">
                  <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 font-bold text-xs mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bullet Point Rewrites / Optimizer */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Project Description & Bullet Point Optimizer</span>
            </h2>

            <div className="space-y-4">
              {analysis.ai_suggestions.bullet_point_improvements.map((bp, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Before */}
                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                      <span className="font-bold text-rose-600 dark:text-rose-400 block text-[10px] uppercase">BEFORE (Passive / Generic):</span>
                      <p className="text-slate-600 dark:text-slate-400">{bp.original}</p>
                    </div>

                    {/* After */}
                    <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-[10px] uppercase">AFTER (High-Impact & Quantified):</span>
                      <p className="text-emerald-900 dark:text-emerald-200 font-semibold">{bp.improved}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200 dark:border-slate-800">
                    💡 <strong>Optimization Rationale:</strong> {bp.reason}
                  </p>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ResumeAnalyzer;
