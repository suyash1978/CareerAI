import React, { useState, useEffect } from 'react';
import { X, Briefcase, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { jobApi } from '../../api/jobApi';

const JobFormModal = ({ isOpen, onClose, jobToEdit = null, onJobSaved }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'FULL_TIME',
    experience_required: 'MID',
    salary_min: '',
    salary_max: '',
    skills_required: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    deadline: '',
    status: 'ACTIVE',
  });

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        title: jobToEdit.title || '',
        company: jobToEdit.company || '',
        location: jobToEdit.location || '',
        job_type: jobToEdit.job_type || 'FULL_TIME',
        experience_required: jobToEdit.experience_required || 'MID',
        salary_min: jobToEdit.salary_min !== null && jobToEdit.salary_min !== undefined ? jobToEdit.salary_min : '',
        salary_max: jobToEdit.salary_max !== null && jobToEdit.salary_max !== undefined ? jobToEdit.salary_max : '',
        skills_required: jobToEdit.skills_required || '',
        description: jobToEdit.description || '',
        responsibilities: jobToEdit.responsibilities || '',
        qualifications: jobToEdit.qualifications || '',
        deadline: jobToEdit.deadline || '',
        status: jobToEdit.status || 'ACTIVE',
      });
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        job_type: 'FULL_TIME',
        experience_required: 'MID',
        salary_min: '',
        salary_max: '',
        skills_required: '',
        description: '',
        responsibilities: '',
        qualifications: '',
        deadline: '',
        status: 'ACTIVE',
      });
    }
  }, [jobToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAiEnhance = async () => {
    if (!formData.title) {
      setError('Please enter a Job Title before enhancing with AI.');
      return;
    }

    setGenerating(true);
    setError('');
    setAiSuccessMsg('');

    try {
      const result = await jobApi.generateJobDescription({
        title: formData.title,
        skills_required: formData.skills_required,
        experience_required: formData.experience_required,
        current_description: formData.description,
      });

      setFormData((prev) => ({
        ...prev,
        description: result.description || prev.description,
        responsibilities: result.responsibilities || prev.responsibilities,
        qualifications: result.qualifications || prev.qualifications,
        skills_required: result.skills_required || prev.skills_required,
      }));

      setAiSuccessMsg('Job posting enhanced using AI!');
      setTimeout(() => setAiSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to generate job description', err);
      setError('Failed to generate AI job description. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      salary_min: formData.salary_min !== '' && formData.salary_min !== null ? formData.salary_min : null,
      salary_max: formData.salary_max !== '' && formData.salary_max !== null ? formData.salary_max : null,
      deadline: formData.deadline !== '' && formData.deadline !== null ? formData.deadline : null,
    };

    try {
      if (jobToEdit) {
        await jobApi.updateJob(jobToEdit.id, payload);
      } else {
        await jobApi.createJob(payload);
      }
      onJobSaved();
      onClose();
    } catch (err) {
      console.error('Failed to save job', err);
      if (err.response?.data) {
        const data = err.response.data;
        if (data.detail) {
          setError(data.detail);
        } else if (typeof data === 'object') {
          const messages = Object.entries(data)
            .map(([key, val]) => `${key.replace('_', ' ')}: ${Array.isArray(val) ? val.join(' ') : val}`)
            .join(' | ');
          setError(messages || 'Failed to save job posting.');
        } else {
          setError('Failed to save job posting.');
        }
      } else {
        setError('Failed to save job posting.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-8 shadow-2xl relative space-y-6 transition-colors duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {jobToEdit ? 'Edit Job Posting' : 'Create Job Posting'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Specify requirements, compensation, and responsibilities</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={generating}
              onClick={handleAiEnhance}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-semibold transition-all"
            >
              {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
              <span>{generating ? 'Generating...' : '✨ Enhance with AI'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {aiSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{aiSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Title & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Job Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior React Developer"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Company Name *</label>
              <input
                type="text"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Tech Solutions"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Location, Job Type, Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Location *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA (Remote)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Job Type *</label>
              <select
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Seniority Level *</label>
              <select
                name="experience_required"
                value={formData.experience_required}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              >
                <option value="ENTRY">Entry Level</option>
                <option value="MID">Mid Level</option>
                <option value="SENIOR">Senior Level</option>
                <option value="LEAD">Lead / Architect</option>
              </select>
            </div>
          </div>

          {/* Salary Min & Max */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Salary Min ($/yr)</label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="e.g. 90000"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Salary Max ($/yr)</label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="e.g. 130000"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* Skills Required */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Required Skills (Comma Separated) *</label>
            <input
              type="text"
              name="skills_required"
              required
              value={formData.skills_required}
              onChange={handleChange}
              placeholder="e.g. React.js, Python, Django, PostgreSQL, Docker"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Job Description *</label>
            <textarea
              rows={3}
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed overview of the role..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>

          {/* Responsibilities */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Key Responsibilities</label>
            <textarea
              rows={3}
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Bullet points of key duties..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>

          {/* Qualifications */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Qualifications & Education</label>
            <textarea
              rows={3}
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="Bullet points of required experience..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-600/20 flex items-center space-x-2 transition-all"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{jobToEdit ? 'Save Changes' : 'Publish Job Posting'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default JobFormModal;
