import axiosInstance from './axiosInstance';
import { API_ENDPOINTS, REFRESH_TOKEN_KEY } from '../utils/constants';

export const authApi = {
  login: async (credentials) => {
    const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      try {
        await axiosInstance.post(API_ENDPOINTS.LOGOUT, { refresh: refreshToken });
      } catch (err) {
        console.warn('Backend logout token blacklist call completed or token already invalid', err);
      }
    }
  },

  getProfile: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await axiosInstance.patch(API_ENDPOINTS.PROFILE, data);
    return response.data;
  },
};
