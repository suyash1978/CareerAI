import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const resumeApi = {
  getResumes: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.RESUMES);
    return response.data;
  },

  getResumeById: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.RESUMES}${id}/`);
    return response.data;
  },

  uploadResume: async (formData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.RESUMES, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  setPrimaryResume: async (id) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.RESUMES}${id}/set_primary/`);
    return response.data;
  },

  updateResume: async (id, data) => {
    const response = await axiosInstance.patch(`${API_ENDPOINTS.RESUMES}${id}/`, data);
    return response.data;
  },

  reparseResume: async (id) => {
    const response = await axiosInstance.post(`${API_ENDPOINTS.RESUMES}${id}/parse/`);
    return response.data;
  },

  deleteResume: async (id) => {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.RESUMES}${id}/`);
    return response.data;
  },
};
