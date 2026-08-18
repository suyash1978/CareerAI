import React, { useState } from 'react';
import { X, Send, FileText, Upload, AlertCircle, CheckCircle2, Loader2, Building, MapPin } from 'lucide-react';
import { jobApi } from '../../api/jobApi';
import { useAuth } from '../../context/AuthContext';

const ApplyModal = ({ isOpen, onClose, job, onAppliedSuccess }) => {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('job', job.id);
      if (coverLetter.trim()) {
        formData.append('cover_letter', coverLetter);
      }
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }

      await jobApi.applyForJob(formData);
      setSuccess(true);
      if (onAppliedSuccess) onAppliedSuccess(job.id);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      const respData = err.response?.data;
      if (typeof respData === 'object' && respData !== null) {
        if (respData.job) {
          setError(Array.isArray(respData.job) ? respData.job[0] : String(respData.job));
        } else if (respData.detail) {
          setError(respData.detail);
        } else {
          const firstKey = Object.keys(respData)[0];
          const val = respData[firstKey];
          setError(Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val));
        }
      } else {
        setError('Failed to submit application. You may have already applied for this position.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200/80 p-6 sm:p-8 my-8 shadow-2xl relative text-slate-900">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 flex items-center justify-center font-bold">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Apply for {job.title}</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{job.company} • {job.location}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>Application submitted successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">

          {/* User Email & Name summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 font-medium">
            <span className="text-slate-500 block font-bold text-[11px]">APPLICANT DETAILS</span>
            <p className="font-extrabold text-slate-900">
              {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username} ({user?.email})
            </p>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Resume File (PDF / DOCX)</label>
            <div className="relative border border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50 hover:bg-white transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              {resumeFile ? (
                <span className="text-xs text-emerald-700 font-bold">{resumeFile.name}</span>
              ) : (
                <span className="text-xs text-slate-500 font-medium">
                  Click to select resume file from device
                </span>
              )}
            </div>
          </div>

          {/* Cover Letter / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Cover Letter / Note to Recruiter</label>
            <textarea
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Introduce yourself, highlight relevant technical projects, and explain why you're a great fit for this role..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium leading-relaxed transition-all"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors shadow-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || success}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ApplyModal;
