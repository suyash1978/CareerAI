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
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    if (score >= 40) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-8 py-4">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-white">AI Career Skill Gap Analysis</h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                  Career Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Select your target career path to analyze missing skills, priority learning roadmaps, and growth milestones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Selector Toolbar */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Preset Roles Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Target Role:</span>
            {PRESET_ROLES.map((roleTitle) => (
              <button
                key={roleTitle}
                onClick={() => handlePresetSelect(roleTitle)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedRole === roleTitle && !selectedJobId
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {roleTitle}
              </button>
            ))}
          </div>

          {/* Active Jobs Selector Dropdown */}
          {activeJobs.length > 0 && (
            <div className="flex items-center space-x-2 min-w-[240px]">
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Or Active Job:</span>
              <select
                value={selectedJobId}
                onChange={handleJobSelect}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
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
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => runAnalysis()} className="underline font-semibold">
            Retry Analysis
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <span className="text-xs text-slate-400 font-medium">Evaluating candidate skills against target requirements...</span>
        </div>
      ) : !analysis ? null : (
        <div className="space-y-8">
          
          {/* Top Summary Banner: Score & Role */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            {/* Readiness Gauge */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400">Target Readiness</span>
              <div className={`text-4xl font-extrabold px-4 py-2 rounded-2xl border ${getScoreColor(analysis.readiness_score)}`}>
                {analysis.readiness_score}%
              </div>
              <span className="text-[11px] text-slate-500">
                {analysis.acquired_skills.length} of {analysis.total_target_skills} Required Skills
              </span>
            </div>

            {/* Target Role Overview */}
            <div className="md:col-span-3 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-white">{analysis.target_title}</h2>
              </div>

              {analysis.ai_guidance && (
                <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
                  <span className="font-semibold text-indigo-400 block">AI Gemini Career Insight:</span>
                  <p className="leading-relaxed whitespace-pre-line">{analysis.ai_guidance}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                <span>Acquired: <strong className="text-emerald-400">{analysis.acquired_skills.length}</strong></span>
                <span>•</span>
                <span>Missing: <strong className="text-amber-400">{analysis.missing_skills.length}</strong></span>
              </div>
            </div>

          </div>

          {/* Skills Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Acquired Skills Card */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  <span>Acquired Skills ({analysis.acquired_skills.length})</span>
                </h3>
              </div>

              {analysis.acquired_skills.length === 0 ? (
                <p className="text-xs text-slate-500 py-4">No matching target skills found in current profile.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.acquired_skills.map((skill, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold flex items-center space-x-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills Card */}
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
                  <AlertCircle className="w-4.5 h-4.5" />
                  <span>Skill Gaps to Acquire ({analysis.missing_skills.length})</span>
                </h3>
              </div>

              {analysis.missing_skills.length === 0 ? (
                <p className="text-xs text-emerald-400 font-medium py-4">🎉 Excellent! You possess all required technical skills for this target role.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_skills.map((skill, idx) => (
                    <span key={idx} className="text-xs px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-semibold">
                      + {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Suggested Learning Priority List */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Suggested Learning Priority List</span>
            </h2>

            {analysis.priority_list.length === 0 ? (
              <p className="text-xs text-slate-400">All target skills acquired. Continue practicing production capstone projects.</p>
            ) : (
              <div className="space-y-3">
                {analysis.priority_list.map((item, idx) => (
                  <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border ${getPriorityBadge(item.priority)}`}>
                        {item.priority} PRIORITY
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.skill}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold self-start sm:self-auto">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Target: {item.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 3-Phase Beginner to Advanced Learning Roadmap */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2 border-b border-slate-800 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Beginner to Advanced Learning Roadmap</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {analysis.roadmap.map((phase, pIdx) => (
                <div key={pIdx} className="glass-card p-6 rounded-3xl border border-slate-800/80 space-y-4 relative flex flex-col justify-between">
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {phase.weeks}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{phase.level}</span>
                    </div>

                    <h3 className="text-base font-bold text-white">{phase.phase}</h3>

                    <ul className="space-y-2 text-xs text-slate-300">
                      {phase.action_items.map((item, aIdx) => (
                        <li key={aIdx} className="flex items-start space-x-2">
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-emerald-400 font-semibold">
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
