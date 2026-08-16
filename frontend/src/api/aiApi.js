import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const aiApi = {
  getStatus: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.AI_STATUS);
    return response.data;
  },

  getAdvice: async (prompt) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AI_ADVICE, { prompt });
    return response.data;
  },

  analyzeSkillGap: async (payload = {}) => {
    const response = await axiosInstance.post(API_ENDPOINTS.SKILL_GAP_ANALYSIS, payload);
    return response.data;
  },

  analyzeResume: async (payload = {}) => {
    const response = await axiosInstance.post(API_ENDPOINTS.RESUME_ANALYSIS, payload);
    return response.data;
  },

  startMockInterview: async (payload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.MOCK_INTERVIEW_START, payload);
    return response.data;
  },

  submitInterviewAnswers: async (sessionId, payload) => {
    const response = await axiosInstance.post(`/ai/interview/${sessionId}/submit/`, payload);
    return response.data;
  },

  getInterviewHistory: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.MOCK_INTERVIEW_HISTORY);
    return response.data;
  },

  getInterviewSession: async (sessionId) => {
    const response = await axiosInstance.get(`/ai/interview/${sessionId}/`);
    return response.data;
  },

  getConversations: async () => {
    const response = await axiosInstance.get('/ai/conversations/');
    return response.data;
  },

  createConversation: async (title = 'Career Advice Session') => {
    const response = await axiosInstance.post('/ai/conversations/', { title });
    return response.data;
  },

  deleteConversation: async (id) => {
    const response = await axiosInstance.delete(`/ai/conversations/${id}/`);
    return response.data;
  },

  getConversationMessages: async (conversationId) => {
    const response = await axiosInstance.get(`/ai/conversations/${conversationId}/messages/`);
    return response.data;
  },

  sendMessage: async (conversationId, text) => {
    const response = await axiosInstance.post(`/ai/conversations/${conversationId}/messages/`, { text });
    return response.data;
  },
};
