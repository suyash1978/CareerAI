import React, { useState, useEffect } from 'react';
import {
  FileText, Sparkles, CheckCircle2, AlertCircle, Award, Target, BookOpen,
  TrendingUp, ArrowRight, ShieldAlert, Loader2, Check, RefreshCw, Layers
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
        setError('No uploaded PDF resumes found. Please upload a resume first.');
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
    if (score >= 85) return 'text-emerald-700 border-emerald-200 bg-emerald-50';
    if (score >= 70) return 'text-blue-700 border-blue-200 bg-blue-50';
    if (score >= 50) return 'text-amber-700 border-amber-200 bg-amber-50';
    return 'text-rose-700 border-rose-200 bg-rose-50';
  };

  return (
    <div className="space-y-8 py-4">

      {/* HospiWise Styled Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 flex items-center justify-center font-extrabold text-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Resume Analyzer</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 uppercase">
                  ATS & Impact Auditor
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Deterministic section audit, empirical score calculation, ATS compliance tips, and metric-driven bullet point rewrites
              </p>
            </div>
          </div>

          {/* Resume Dropdown Selector */}
          {resumes.length > 0 && (
            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <FileText className="w-4 h-4 text-purple-600" />
              <select
                value={selectedResumeId}
                onChange={handleSelectResume}
                className="bg-slate-50 text-slate-900 text-xs font-bold focus:outline-none pr-2"
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
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
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
          <span className="text-xs text-slate-500 font-semibold">Auditing resume structure, contact completeness, and action verbs...</span>
        </div>
      ) : !analysis ? null : (
        <div className="space-y-8">

          {/* Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start space-x-3 font-medium">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
            <div>
              <span className="font-extrabold text-amber-900 block mb-0.5">ATS ANALYSIS DISCLAIMER</span>
              <p className="leading-relaxed">{analysis.disclaimer}</p>
            </div>
          </div>

          {/* Top Score Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

            {/* Score Gauge */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <span className="text-xs font-bold text-slate-500">Resume Quality Score</span>
              <div className={`text-4xl font-extrabold px-5 py-2.5 rounded-2xl border ${getScoreColor(analysis.resume_score)}`}>
                {analysis.resume_score} / 100
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                Deterministic Audit Score
              </span>
            </div>

            {/* Sub-Checks Breakdown */}
            <div className="md:col-span-3 space-y-4 text-xs">
              <h3 className="font-extrabold text-slate-900 text-sm">Empirical Structural Audit Breakdown</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                  <span className="text-slate-500 block font-medium">Contact Info Completeness</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {analysis.deterministic_checks.contact_completeness.score} / 30 pts
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                  <span className="text-slate-500 block font-medium">Core Sections Audit</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {analysis.deterministic_checks.section_audit.score} / 50 pts
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1">
                  <span className="text-slate-500 block font-medium">Action Verbs & Impact</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {analysis.deterministic_checks.content_metrics.score} / 20 pts
                  </span>
                </div>
              </div>

              {analysis.deterministic_checks.missing_sections.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
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
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-emerald-700 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                <span>Identified Strengths</span>
              </h3>

              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                {analysis.ai_suggestions.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Areas for Improvement */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <h3 className="text-sm font-extrabold text-amber-700 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
                <span>Areas for Improvement</span>
              </h3>

              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                {analysis.ai_suggestions.weaknesses.map((weak, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Skills to Highlight */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Target className="w-4.5 h-4.5 text-indigo-600" />
              <span>Recommended Skills to Highlight on Resume</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {analysis.ai_suggestions.skills_to_highlight.map((skill, idx) => (
                <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold">
                  ★ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* ATS Compatibility Tips */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-purple-600" />
              <span>ATS Compatibility Recommendations</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {analysis.ai_suggestions.ats_compatibility_tips.map((tip, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex items-start space-x-3 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bullet Point Rewrites / Optimizer */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Project Description & Bullet Point Optimizer</span>
            </h2>

            <div className="space-y-4">
              {analysis.ai_suggestions.bullet_point_improvements.map((bp, idx) => (
                <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3">

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Before */}
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-1">
                      <span className="font-extrabold text-rose-700 block text-[11px]">BEFORE (Passive / Generic):</span>
                      <p className="text-slate-700 font-medium">{bp.original}</p>
                    </div>

                    {/* After */}
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="font-extrabold text-emerald-700 block text-[11px]">AFTER (High-Impact & Quantified):</span>
                      <p className="text-emerald-900 font-bold">{bp.improved}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60 font-medium">
                    💡 <strong className="text-slate-700 font-bold">Optimization Rationale:</strong> {bp.reason}
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
