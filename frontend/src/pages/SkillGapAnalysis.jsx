import React, { useState, useEffect } from 'react';
import {
  Target, Sparkles, CheckCircle2, AlertCircle, TrendingUp, Clock, BookOpen,
  Check, ArrowRight, Layers, Award, Loader2, RefreshCw, Zap, Building
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { jobApi } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';

const PRESET_ROLES = [
  'Full-Stack Engineer',
  'AI/ML Specialist',
  'DevOps & Cloud Specialist',
  'Backend Python Architect',
  'Frontend React Specialist'
];

const SkillGapAnalysis = () => {
  const { user } = useAuth();

  const [selectedRole, setSelectedRole] = useState('Full-Stack Engineer');
  const [activeJobs, setActiveJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveJobs();
    runAnalysis();
  }, []);

  const fetchActiveJobs = async () => {
    try {
      const data = await jobApi.getJobs();
      setActiveJobs(data.results || data || []);
    } catch (err) {
      console.error('Failed to load active jobs for dropdown', err);
    }
  };

  const runAnalysis = async (jobId = selectedJobId, roleTitle = selectedRole) => {
    setLoading(true);
    setError('');

    try {
      const payload = {};
      if (jobId) {
        payload.job_id = jobId;
      } else {
        payload.target_role = roleTitle;
      }

      const res = await aiApi.analyzeSkillGap(payload);
      setAnalysis(res);
    } catch (err) {
      console.error('Failed to analyze skill gap', err);
      setError('Failed to analyze skill gap. Please try selecting a different target role.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (roleTitle) => {
    setSelectedRole(roleTitle);
    setSelectedJobId('');
    runAnalysis('', roleTitle);
  };

  const handleJobSelect = (e) => {
    const jobId = e.target.value;
    setSelectedJobId(jobId);
    if (jobId) {
      const jobObj = activeJobs.find((j) => String(j.id) === String(jobId));
      if (jobObj) setSelectedRole(jobObj.title);
      runAnalysis(jobId, '');
    } else {
      runAnalysis('', selectedRole);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 border-emerald-200 bg-emerald-50';
    if (score >= 60) return 'text-blue-700 border-blue-200 bg-blue-50';
    if (score >= 40) return 'text-amber-700 border-amber-200 bg-amber-50';
    return 'text-rose-700 border-rose-200 bg-rose-50';
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-8 py-4">

      {/* HospiWise Styled Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center font-extrabold text-xl">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Career Skill Gap Analysis</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase">
                  Career Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Select your target career path to analyze missing skills, priority learning roadmaps, and growth milestones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Selector Toolbar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Preset Roles Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 mr-1">Target Role:</span>
            {PRESET_ROLES.map((roleTitle) => (
              <button
                key={roleTitle}
                onClick={() => handlePresetSelect(roleTitle)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedRole === roleTitle && !selectedJobId
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {roleTitle}
              </button>
            ))}
          </div>

          {/* Active Jobs Selector Dropdown */}
          {activeJobs.length > 0 && (
            <div className="flex items-center space-x-2 min-w-[240px]">
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Or Active Job:</span>
              <select
                value={selectedJobId}
                onChange={handleJobSelect}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
              >
                <option value="">Select from Active Job Postings...</option>
                {activeJobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title} ({j.company})
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
          <button onClick={() => runAnalysis()} className="underline font-bold">
            Retry Analysis
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <span className="text-xs text-slate-500 font-semibold">Evaluating candidate skills against target requirements...</span>
        </div>
      ) : !analysis ? null : (
        <div className="space-y-8">

          {/* Top Summary Banner: Score & Role */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

            {/* Readiness Gauge */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <span className="text-xs font-bold text-slate-500">Target Readiness</span>
              <div className={`text-4xl font-extrabold px-5 py-2.5 rounded-2xl border ${getScoreColor(analysis.readiness_score)}`}>
                {analysis.readiness_score}%
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">
                {analysis.acquired_skills.length} of {analysis.total_target_skills} Required Skills
              </span>
            </div>

            {/* Target Role Overview */}
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-extrabold text-slate-900">{analysis.target_title}</h2>
              </div>

              {analysis.ai_guidance && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1 font-medium">
                  <span className="font-extrabold text-indigo-700 block">AI Gemini Career Insight:</span>
                  <p className="leading-relaxed whitespace-pre-line">{analysis.ai_guidance}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-slate-500 font-semibold">
                <span>Acquired: <strong className="text-emerald-700 font-extrabold">{analysis.acquired_skills.length}</strong></span>
                <span>•</span>
                <span>Missing: <strong className="text-amber-700 font-extrabold">{analysis.missing_skills.length}</strong></span>
              </div>
            </div>

          </div>

          {/* Skills Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Acquired Skills Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-emerald-700 flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  <span>Acquired Skills ({analysis.acquired_skills.length})</span>
                </h3>
              </div>

              {analysis.acquired_skills.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 font-medium">No matching target skills found in current profile.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.acquired_skills.map((skill, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-amber-700 flex items-center space-x-2">
                  <AlertCircle className="w-4.5 h-4.5" />
                  <span>Skill Gaps to Acquire ({analysis.missing_skills.length})</span>
                </h3>
              </div>

              {analysis.missing_skills.length === 0 ? (
                <p className="text-xs text-emerald-700 font-bold py-4">🎉 Excellent! You possess all required technical skills for this target role.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills.map((skill, idx) => (
                    <span key={idx} className="text-xs px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-bold">
                      + {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Suggested Learning Priority List */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Zap className="w-5 h-5 text-amber-600" />
              <span>Suggested Learning Priority List</span>
            </h2>

            {analysis.priority_list.length === 0 ? (
              <p className="text-xs text-slate-500 font-medium">All target skills acquired. Continue practicing production capstone projects.</p>
            ) : (
              <div className="space-y-3">
                {analysis.priority_list.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${getPriorityBadge(item.priority)}`}>
                        {item.priority} PRIORITY
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.skill}</h4>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-indigo-700 font-bold self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Target: {item.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3-Phase Beginner to Advanced Learning Roadmap */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Beginner to Advanced Learning Roadmap</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.roadmap.map((phase, pIdx) => (
                <div key={pIdx} className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 space-y-4 relative flex flex-col justify-between">

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        {phase.weeks}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold">{phase.level}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{phase.phase}</h3>

                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      {phase.action_items.map((item, aIdx) => (
                        <li key={aIdx} className="flex items-start space-x-2">
                          <ArrowRight className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-emerald-700 font-extrabold">
                    🎯 Milestone: {phase.milestone}
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default SkillGapAnalysis;
