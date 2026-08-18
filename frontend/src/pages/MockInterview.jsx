import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Sparkles, CheckCircle2, AlertCircle, Play, ChevronRight,
  ChevronLeft, Award, Clock, History, Loader2, Send, RotateCcw, HelpCircle,
  Code, UserCheck, Briefcase, Zap
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
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PROJECT':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'HR':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-700 border-emerald-200 bg-emerald-50';
    if (score >= 70) return 'text-blue-700 border-blue-200 bg-blue-50';
    if (score >= 55) return 'text-amber-700 border-amber-200 bg-amber-50';
    return 'text-rose-700 border-rose-200 bg-rose-50';
  };

  return (
    <div className="space-y-8 py-4">

      {/* HospiWise Styled Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center font-extrabold text-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Mock Interview Simulator</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 uppercase">
                  Real-Time Evaluation
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Practice technical, project-based, and HR interview questions tailored to your skills and target role
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs self-start md:self-auto"
          >
            <History className="w-4 h-4 text-blue-600" />
            <span>{showHistory ? 'Hide History' : `Interview History (${history.length})`}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
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
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
            <History className="w-4 h-4 text-blue-600" />
            <span>Completed Interview Sessions</span>
          </h3>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 font-medium">No completed mock interview history found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {history.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleViewHistoricalSession(s.id)}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:shadow-md cursor-pointer space-y-2 group transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-blue-600">{s.target_role}</span>
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getScoreColor(s.overall_score)}`}>
                      {s.overall_score}% Score
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium space-y-0.5">
                    <p>Level: {s.experience_level} • Status: {s.status}</p>
                    <p className="text-slate-400">{s.created_at}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODE 1: SETUP SCREEN */}
      {mode === 'SETUP' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>Configure Interview Simulation</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Select your target role, seniority level, and key technology stack to generate tailored questions.
            </p>
          </div>

          <form onSubmit={handleStartInterview} className="space-y-6">

            {/* Target Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Target Job Title / Role</label>
              <input
                type="text"
                required
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack Developer, AI Engineer"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-slate-500 font-bold self-center">Presets:</span>
                {PRESET_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTargetRole(r)}
                    className="text-[11px] px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Target Seniority Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setExperienceLevel(lvl.id)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all ${experienceLevel === lvl.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 border-blue-600'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Technologies */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Required Technologies & Skills</label>
              <input
                type="text"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                placeholder="e.g. React, Python, Django, PostgreSQL, Docker, AWS"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
              />
            </div>

            {/* Optional Active Job Selector */}
            {activeJobs.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Align with Active Job Posting (Optional)</label>
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-500"
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
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Interview Questions...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start AI Mock Interview Simulation</span>
                </>
              )}
            </button>

          </form>
        </div>
      )}

      {/* MODE 2: LIVE QUESTION STEPPER */}
      {mode === 'LIVE' && sessionData && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">

          {/* Stepper Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-900">
                Question {currentQuestionIdx + 1} of {sessionData.questions.length}
              </span>
              <span className="text-slate-500 font-bold">{sessionData.target_role}</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${((currentQuestionIdx + 1) / sessionData.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          {(() => {
            const q = sessionData.questions[currentQuestionIdx];
            if (!q) return null;

            return (
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/60 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getQuestionBadgeColor(q.question_type)}`}>
                    {q.question_type} QUESTION
                  </span>

                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                    Difficulty: {q.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {q.question_text}
                </h3>

                {/* Candidate Answer Textarea */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Your Response:</span>
                    <span className="text-[11px] text-slate-400">
                      {(userAnswers[q.id] || '').length} characters
                    </span>
                  </label>

                  <textarea
                    rows={6}
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Type your response using technical details, architecture decisions, and real-world project context (STAR method recommended)..."
                    className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 leading-relaxed font-medium transition-all"
                  />
                </div>

                {/* Guidance Tip Box */}
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-800 flex items-center space-x-2 font-medium">
                  <HelpCircle className="w-4 h-4 flex-shrink-0 text-blue-600" />
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
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${currentQuestionIdx === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            {currentQuestionIdx < sessionData.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx((prev) => Math.min(sessionData.questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1 transition-all shadow-md shadow-blue-500/25"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleSubmitInterview}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-emerald-500/25 transition-all"
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
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md grid grid-cols-1 md:grid-cols-4 gap-6 items-center">

            {/* Overall Score Gauge */}
            <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-5 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
              <span className="text-xs font-bold text-slate-500">Overall Interview Score</span>
              <div className={`text-4xl font-extrabold px-5 py-2.5 rounded-2xl border ${getScoreColor(evaluation.overall_score)}`}>
                {evaluation.overall_score}%
              </div>
              <span className="text-[11px] text-slate-500 font-bold">
                {evaluation.target_role}
              </span>
            </div>

            {/* Overall Rationale & Reset */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-extrabold text-slate-900">AI Evaluation Scorecard</h2>
                </div>

                <button
                  onClick={() => { setMode('SETUP'); setEvaluation(null); }}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start New Simulation</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-2 font-medium">
                <p className="leading-relaxed font-semibold">{evaluation.overall_feedback?.summary}</p>
              </div>
            </div>

          </div>

          {/* Per-Question Detailed Breakdown */}
          <div className="space-y-6">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span>Detailed Question Evaluation & AI Feedback</span>
            </h3>

            <div className="space-y-4">
              {evaluation.questions.map((q, idx) => (
                <div key={q.id || idx} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4">

                  {/* Question Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${getQuestionBadgeColor(q.question_type)}`}>
                        Q{q.question_number} • {q.question_type}
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold">Difficulty: {q.difficulty}</span>
                    </div>

                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getScoreColor(q.score)}`}>
                      Score: {q.score} / 100
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{q.question_text}</h4>

                  {/* Candidate Answer */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs space-y-1 font-medium">
                    <span className="text-slate-500 font-bold block text-[11px]">YOUR SUBMITTED RESPONSE:</span>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-line">
                      {q.user_answer || <em className="text-slate-400">No response submitted.</em>}
                    </p>
                  </div>

                  {/* Strengths & Improvements Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

                    {/* Strengths */}
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5 font-medium">
                      <span className="font-extrabold text-emerald-800 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Demonstrated Strengths</span>
                      </span>
                      <ul className="space-y-1 text-emerald-900">
                        {q.strengths?.map((s, sIdx) => (
                          <li key={sIdx}>• {s}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5 font-medium">
                      <span className="font-extrabold text-amber-800 flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Key Areas for Improvement</span>
                      </span>
                      <ul className="space-y-1 text-amber-900">
                        {q.improvements?.map((imp, iIdx) => (
                          <li key={iIdx}>• {imp}</li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* AI Recommended Ideal Answer */}
                  {q.ideal_answer && (
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs space-y-1 font-medium">
                      <span className="font-extrabold text-blue-800 flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>AI Recommended Ideal Answer Formulation:</span>
                      </span>
                      <p className="text-blue-950 leading-relaxed italic">
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
