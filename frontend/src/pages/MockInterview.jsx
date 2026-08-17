import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Sparkles, CheckCircle2, AlertCircle, Play, ChevronRight,
  ChevronLeft, Award, History, Loader2, Send, RotateCcw, HelpCircle,
  Check, Zap
} from 'lucide-react';
import { aiApi } from '../api/aiApi';
import { jobApi } from '../api/jobApi';
import { useAuth } from '../context/AuthContext';

const PRESET_ROLES = [
  'Full-Stack Developer',
  'AI/ML Engineer',
  'DevOps Specialist',
  'Backend Django Architect',
  'Frontend React Engineer'
];

const EXPERIENCE_LEVELS = [
  { id: 'ENTRY', label: 'Entry Level (0-2 Yrs)' },
  { id: 'MID', label: 'Mid-Level (2-5 Yrs)' },
  { id: 'SENIOR', label: 'Senior (5-8 Yrs)' },
  { id: 'LEAD', label: 'Lead / Architect (8+ Yrs)' },
];

const MockInterview = () => {
  const { user } = useAuth();

  // Mode: 'SETUP' | 'LIVE' | 'SCORECARD'
  const [mode, setMode] = useState('SETUP');

  // Setup Form State
  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [experienceLevel, setExperienceLevel] = useState('MID');
  const [technologies, setTechnologies] = useState('React, Python, Django, PostgreSQL');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [activeJobs, setActiveJobs] = useState([]);

  // Session & Questions State
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // History & Evaluation State
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveJobs();
    fetchHistory();
  }, []);

  const fetchActiveJobs = async () => {
    try {
      const data = await jobApi.getJobs();
      setActiveJobs(data.results || data || []);
    } catch (err) {
      console.error('Failed to load active jobs', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await aiApi.getInterviewHistory();
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to fetch interview history', err);
    }
  };

  const handleStartInterview = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await aiApi.startMockInterview({
        target_role: targetRole,
        experience_level: experienceLevel,
        technologies: technologies,
        job_id: selectedJobId || null
      });

      setSessionData(res);
      setUserAnswers({});
      setCurrentQuestionIdx(0);
      setMode('LIVE');
    } catch (err) {
      console.error('Failed to start interview', err);
      setError(err.response?.data?.error || 'Failed to start interview session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qId, val) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleSubmitInterview = async () => {
    if (!sessionData) return;
    setLoading(true);
    setError('');

    try {
      const res = await aiApi.submitInterviewAnswers(sessionData.session_id, {
        answers: userAnswers
      });
      setEvaluation(res);
      setMode('SCORECARD');
      fetchHistory();
    } catch (err) {
      console.error('Failed to submit interview answers', err);
      setError('Failed to submit answers for evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistoricalSession = async (sId) => {
    setLoading(true);
    try {
      const res = await aiApi.getInterviewSession(sId);
      setEvaluation(res);
      setMode('SCORECARD');
    } catch (err) {
      console.error('Failed to fetch session detail', err);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionBadgeColor = (type) => {
    switch (type) {
      case 'TECHNICAL':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'PROJECT':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'HR':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40';
    if (score >= 70) return 'text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40';
    if (score >= 55) return 'text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40';
    return 'text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40';
  };

  return (
    <div className="space-y-8 py-4 transition-colors duration-200">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">AI Mock Interview Simulator</h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 uppercase tracking-wider">
                  Real-Time Evaluation
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Practice technical, project-based, and HR interview questions tailored to your skills and target role
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all self-start md:self-auto"
          >
            <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>{showHistory ? 'Hide History' : `Interview History (${history.length})`}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="underline font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* History Drawer */}
      {showHistory && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Completed Interview Sessions</span>
          </h3>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500">No completed mock interview history found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {history.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleViewHistoricalSession(s.id)}
                  className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer space-y-2 group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{s.target_role}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getScoreColor(s.overall_score)}`}>
                      {s.overall_score}% Score
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-0.5">
                    <p>Level: {s.experience_level} • Status: {s.status}</p>
                    <p className="text-slate-400 font-medium">{s.created_at}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE 1: SETUP SCREEN */}
      {mode === 'SETUP' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Configure Interview Simulation</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select your target role, seniority level, and key technology stack to generate tailored questions.
            </p>
          </div>

          <form onSubmit={handleStartInterview} className="space-y-6">
            
            {/* Target Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Target Job Title / Role</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack Developer, AI Engineer"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-slate-400 font-bold self-center">Presets:</span>
                {PRESET_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTargetRole(r)}
                    className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Target Seniority Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperienceLevel(lvl.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all ${
                      experienceLevel === lvl.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-600 text-indigo-700 dark:text-indigo-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Technologies */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Required Technologies & Skills</label>
              <input
                type="text"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="e.g. React, Python, Django, PostgreSQL, Docker, AWS"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>

            {/* Optional Active Job Selector */}
            {activeJobs.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Align with Active Job Posting (Optional)</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    const j = activeJobs.find((item) => String(item.id) === e.target.value);
                    if (j) {
                      setTargetRole(j.title);
                      if (j.skills_required) setTechnologies(j.skills_required);
                    }
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600"
                >
                  <option value="">None (Custom Configuration)</option>
                  {activeJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} ({job.company})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Interview Questions...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start AI Mock Interview Simulation</span>
                </>
              )}
            </button>

          </form>
        </div>
      )}

      {/* MODE 2: LIVE QUESTION STEPPER */}
      {mode === 'LIVE' && sessionData && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          
          {/* Stepper Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white">
                Question {currentQuestionIdx + 1} of {sessionData.questions.length}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-bold">{sessionData.target_role}</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / sessionData.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {(() => {
            const q = sessionData.questions[currentQuestionIdx];
            if (!q) return null;

            return (
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${getQuestionBadgeColor(q.question_type)}`}>
                    {q.question_type} QUESTION
                  </span>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    Difficulty: {q.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {q.question_text}
                </h3>

                {/* Candidate Answer Textarea */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Your Response:</span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {(userAnswers[q.id] || '').length} characters
                    </span>
                  </label>

                  <textarea
                    rows={6}
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Type your response using technical details, architecture decisions, and real-world project context..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 leading-relaxed"
                  />
                </div>

                {/* Guidance Tip Box */}
                <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300 flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span>Tip: Mention specific technology keywords ({sessionData.technologies}) and quantify your achievements.</span>
                </div>
              </div>
            );
          })()}

          {/* Stepper Navigation Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentQuestionIdx === 0}
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                currentQuestionIdx === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 text-slate-400'
                  : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            {currentQuestionIdx < sessionData.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((prev) => Math.min(sessionData.questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1 transition-all shadow-sm"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleSubmitInterview}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 shadow-sm transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Answers...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Interview for AI Evaluation</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>
      )}

      {/* MODE 3: EVALUATION SCORECARD DASHBOARD */}
      {mode === 'SCORECARD' && evaluation && (
        <div className="space-y-8">
          
          {/* Top Score & Feedback Banner */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            {/* Overall Score Gauge */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Overall Interview Score</span>
              <div className={`text-4xl font-extrabold px-5 py-2.5 rounded-2xl border ${getScoreColor(evaluation.overall_score)}`}>
                {evaluation.overall_score}%
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold">
                {evaluation.target_role}
              </span>
            </div>

            {/* Overall Rationale & Reset */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Evaluation Scorecard</h2>
                </div>

                <button
                  onClick={() => { setMode('SETUP'); setEvaluation(null); }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Simulation</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300 space-y-2">
                <p className="leading-relaxed font-medium">{evaluation.overall_feedback?.summary}</p>
              </div>
            </div>

          </div>

          {/* Per-Question Detailed Breakdown */}
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Detailed Question Evaluation & AI Feedback</span>
            </h3>

            <div className="space-y-4">
              {evaluation.questions.map((q, idx) => (
                <div key={q.id || idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  
                  {/* Question Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${getQuestionBadgeColor(q.question_type)}`}>
                        Q{q.question_number} • {q.question_type}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Difficulty: {q.difficulty}</span>
                    </div>

                    <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${getScoreColor(q.score)}`}>
                      Score: {q.score} / 100
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.question_text}</h4>

                  {/* Candidate Answer */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 dark:text-slate-500 font-bold block text-[10px] uppercase">YOUR SUBMITTED RESPONSE:</span>
                    <p className="text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                      {q.user_answer || <em className="text-slate-400">No response submitted.</em>}
                    </p>
                  </div>

                  {/* Strengths & Improvements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    
                    {/* Strengths */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Demonstrated Strengths</span>
                      </span>
                      <ul className="space-y-1 text-emerald-900 dark:text-emerald-200 font-medium">
                        {q.strengths?.map((s, sIdx) => (
                          <li key={sIdx}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1.5">
                      <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Key Areas for Improvement</span>
                      </span>
                      <ul className="space-y-1 text-amber-900 dark:text-amber-200 font-medium">
                        {q.improvements?.map((imp, iIdx) => (
                          <li key={iIdx}>• {imp}</li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* AI Recommended Ideal Answer */}
                  {q.ideal_answer && (
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-1">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Recommended Ideal Answer Formulation:</span>
                      </span>
                      <p className="text-indigo-900 dark:text-indigo-200 leading-relaxed italic font-medium">
                        "{q.ideal_answer}"
                      </p>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default MockInterview;
