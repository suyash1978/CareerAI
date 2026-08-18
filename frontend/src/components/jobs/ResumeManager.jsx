import React, { useState, useEffect } from 'react';
import {
  Upload, FileText, Star, Trash2, Edit3, Save, CheckCircle2,
  AlertCircle, Loader2, Sparkles, Download, RefreshCw, Eye, User, Mail, Phone
} from 'lucide-react';
import { getMediaUrl } from '../../utils/constants';
import { resumeApi } from '../../api/resumeApi';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  // Extracted Info Edit Form State
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    education: '',
    experience: '',
    projects: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const data = await resumeApi.getResumes();
      const list = data.results || data || [];
      setResumes(list);

      if (list.length > 0) {
        const primary = list.find((r) => r.is_primary) || list[0];
        setSelectedResume(primary);
        populateEditForm(primary);
      }
    } catch (err) {
      console.error('Failed to fetch resumes', err);
    } finally {
      setLoading(false);
    }
  };

  const populateEditForm = (resume) => {
    if (!resume) return;
    setEditData({
      name: resume.name || '',
      email: resume.email || '',
      phone: resume.phone || '',
      skills: resume.skills || '',
      education: resume.education || '',
      experience: resume.experience || '',
      projects: resume.projects || '',
    });
  };

  const handleSelectResume = (resume) => {
    setSelectedResume(resume);
    populateEditForm(resume);
    setEditSuccess('');
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setUploadError('Only PDF files (.pdf) are allowed.');
        setSelectedFile(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError('Resume file size cannot exceed 10MB.');
        setSelectedFile(null);
        return;
      }

      setUploadError('');
      setSelectedFile(file);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.pdf$/i, ''));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setUploadError('Please select a valid PDF file to upload.');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('title', uploadTitle || selectedFile.name);
      formData.append('file', selectedFile);

      await resumeApi.uploadResume(formData);
      setUploadSuccess('Resume uploaded and parsed successfully!');
      setUploadTitle('');
      setSelectedFile(null);
      fetchResumes();
      setTimeout(() => setUploadSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to upload resume', err);
      setUploadError(err.response?.data?.file?.[0] || err.response?.data?.detail || 'Failed to upload resume file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (resumeId, e) => {
    e.stopPropagation();
    try {
      await resumeApi.setPrimaryResume(resumeId);
      fetchResumes();
    } catch (err) {
      console.error('Failed to set primary resume', err);
    }
  };

  const handleDeleteResume = async (resumeId, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this resume?')) return;
    try {
      await resumeApi.deleteResume(resumeId);
      fetchResumes();
    } catch (err) {
      console.error('Failed to delete resume', err);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEditedInfo = async (e) => {
    e.preventDefault();
    if (!selectedResume) return;

    setSavingEdit(true);
    setEditSuccess('');

    try {
      await resumeApi.updateResume(selectedResume.id, editData);
      setEditSuccess('Extracted resume details updated!');
      fetchResumes();
      setTimeout(() => setEditSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update resume details', err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleReParse = async () => {
    if (!selectedResume) return;
    setSavingEdit(true);
    setEditSuccess('');

    try {
      const res = await resumeApi.parseResume(selectedResume.id);
      if (res.resume) {
        populateEditForm(res.resume);
        setEditSuccess('Re-parsed PDF resume text!');
        fetchResumes();
      }
    } catch (err) {
      console.error('Failed to re-parse resume', err);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Upload New Resume Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 flex items-center justify-center font-bold">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Upload New PDF Resume</h2>
            <p className="text-xs text-slate-500 font-medium">PDF format • Max 10MB • Text extracted automatically</p>
          </div>
        </div>

        {uploadError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Resume Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer Resume 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select PDF File *</label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-blue-500/25 transition-all disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing PDF Text...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Upload & Parse Resume</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Grid: Resume List + Extracted Info Review & Edit Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: My Uploaded Resumes */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-md space-y-4 h-fit">
          <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>My Resumes ({resumes.length})</span>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
          </h3>

          {resumes.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">No resumes uploaded yet. Use the upload form above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((r) => {
                const isSelected = selectedResume?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => handleSelectResume(r)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'bg-slate-50 border-slate-200/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-500'}`} />
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{r.title || 'Untitled Resume'}</span>
                      </div>

                      {r.is_primary && (
                        <span className="flex items-center space-x-1 text-[10px] font-extrabold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Primary</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                      <span>{new Date(r.created_at).toLocaleDateString()}</span>

                      <div className="flex items-center space-x-1">
                        {!r.is_primary && (
                          <button
                            onClick={(e) => handleSetPrimary(r.id, e)}
                            className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors shadow-xs"
                            title="Set as Primary Resume"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
                          </button>
                        )}

                        <a
                          href={getMediaUrl(r.file)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-blue-600 transition-colors shadow-xs"
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={(e) => handleDeleteResume(r.id, e)}
                          className="p-1 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-600 transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Extracted Info Review & Edit Panel */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <span>Review & Edit Extracted Resume Data</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Parsed from <strong className="text-slate-900 font-bold">{selectedResume?.title || 'Selected Resume'}</strong>
              </p>
            </div>

            {selectedResume && (
              <button
                onClick={handleReParse}
                disabled={savingEdit}
                className="inline-flex items-center space-x-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>Re-Parse PDF</span>
              </button>
            )}
          </div>

          {editSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{editSuccess}</span>
            </div>
          )}

          {!selectedResume ? (
            <div className="text-center py-12 space-y-2">
              <Eye className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500 font-medium">Select a resume from the list to review its extracted text.</p>
            </div>
          ) : (
            <form onSubmit={handleSaveEditedInfo} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Extracted Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder="Candidate Name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Extracted Email</label>
                  <input
                    type="text"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    placeholder="candidate@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Extracted Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={editData.phone}
                    onChange={handleEditChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Extracted Skills (Comma Separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={editData.skills}
                  onChange={handleEditChange}
                  placeholder="e.g. React.js, Python, Django, PostgreSQL, Docker"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Education Background</label>
                <textarea
                  rows={2}
                  name="education"
                  value={editData.education}
                  onChange={handleEditChange}
                  placeholder="Degree, major, institution..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 leading-relaxed font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Experience Summary</label>
                <textarea
                  rows={3}
                  name="experience"
                  value={editData.experience}
                  onChange={handleEditChange}
                  placeholder="Past roles, achievements, responsibilities..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 leading-relaxed font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Projects & Capstones</label>
                <textarea
                  rows={2}
                  name="projects"
                  value={editData.projects}
                  onChange={handleEditChange}
                  placeholder="Key project highlights..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 leading-relaxed font-medium transition-all"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-500/25 transition-all disabled:opacity-50"
                >
                  {savingEdit ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Verified Information</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};

export default ResumeManager;
