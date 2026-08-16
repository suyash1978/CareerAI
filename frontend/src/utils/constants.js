export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export const getMediaUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') {
    if (path.file) path = path.file;
    else if (path.url) path = path.url;
  }
  if (typeof path !== 'string') return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BACKEND_URL}${cleanPath}`;
};

export const TOKEN_KEY = 'careerai_token';
export const REFRESH_TOKEN_KEY = 'careerai_refresh_token';
export const USER_KEY = 'careerai_user';

export const ROLES = {
  JOB_SEEKER: 'JOB_SEEKER',
  RECRUITER: 'RECRUITER',
  ADMIN: 'ADMIN',
};

export const API_ENDPOINTS = {
  HEALTH: '/health/',
  REGISTER: '/accounts/register/',
  LOGIN: '/accounts/login/',
  LOGOUT: '/accounts/logout/',
  REFRESH_TOKEN: '/accounts/token/refresh/',
  PROFILE: '/accounts/me/',
  JOBS: '/jobs/',
  APPLICATIONS: '/jobs/applications/',
  RESUMES: '/jobs/resumes/',
  AI_STATUS: '/ai/status/',
  AI_ADVICE: '/ai/advice/',
  SKILL_GAP_ANALYSIS: '/ai/skill-gap-analysis/',
  RESUME_ANALYSIS: '/ai/resume-analysis/',
  MOCK_INTERVIEW_START: '/ai/interview/start/',
  MOCK_INTERVIEW_HISTORY: '/ai/interview/history/',
};
