import axiosInstance from './axiosInstance';

export const adminApi = {
  getAnalytics: async () => {
    const response = await axiosInstance.get('/admin/analytics/');
    return response.data;
  },

  getUsers: async (params = {}) => {
    const response = await axiosInstance.get('/admin/users/', { params });
    return response.data;
  },

  toggleUserStatus: async (userId, isActive) => {
    const response = await axiosInstance.patch('/admin/users/', {
      user_id: userId,
      is_active: isActive,
    });
    return response.data;
  },

  getJobs: async (params = {}) => {
    const response = await axiosInstance.get('/admin/jobs/', { params });
    return response.data;
  },

  moderateJob: async (jobId, action) => {
    const response = await axiosInstance.post(`/admin/jobs/${jobId}/moderate/`, { action });
    return response.data;
  },

  getApplications: async () => {
    const response = await axiosInstance.get('/admin/applications/');
    return response.data;
  },
};
