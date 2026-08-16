import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const jobApi = {
  getJobs: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.JOBS, { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}${id}/`);
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.JOBS, jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.JOBS}${id}/`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.JOBS}${id}/`);
    return response.data;
  },

  toggleJobStatus: async (id) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.JOBS}${id}/toggle_status/`);
    return response.data;
  },

  getMyPostedJobs: async (params = {}) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}my_jobs/`, { params });
    return response.data;
  },

  saveJob: async (id) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.JOBS}${id}/save_job/`);
    return response.data;
  },

  getSavedJobs: async (params = {}) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}saved/`, { params });
    return response.data;
  },

  getApplicants: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}${id}/applicants/`);
    return response.data;
  },

  getRankedApplicants: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}${id}/ranked_applicants/`);
    return response.data;
  },

  generateJobDescription: async (payload) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.JOBS}generate_description/`, payload);
    return response.data;
  },

  applyForJob: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await axiosInstance.post(API_ENDPOINTS.APPLICATIONS, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  getMyApplications: async (params = {}) => {
    const response = await axiosInstance.get(API_ENDPOINTS.APPLICATIONS, { params });
    return response.data;
  },

  withdrawApplication: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.APPLICATIONS}${id}/`);
    return response.data;
  },

  updateApplicationStatus: async (id, payload) => {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.APPLICATIONS}${id}/`, payload);
    return response.data;
  },

  getApplicationStats: async () => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.APPLICATIONS}stats/`);
    return response.data;
  },

  getRecommendedJobs: async (params = {}) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}recommendations/`, { params });
    return response.data;
  },

  getJobMatchDetails: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.JOBS}${id}/match_details/`);
    return response.data;
  },
};
