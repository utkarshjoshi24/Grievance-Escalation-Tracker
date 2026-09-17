// API Service Layer for Grievance Escalation Tracker
// Supports backend connection via VITE_API_BASE_URL and provides clean typed abstractions

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token when available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('get_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Network request failed',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
    };
    return Promise.reject(customError);
  }
);

export const api = {
  // Authentication
  auth: {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    register: (userData) => apiClient.post('/auth/register', userData),
    getProfile: () => apiClient.get('/auth/me'),
    logout: () => apiClient.post('/auth/logout'),
  },

  // Public Tracking & Grievance Submission
  grievances: {
    submit: (formData) => apiClient.post('/grievances', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    trackByToken: (token) => apiClient.get(`/grievances/track/${token}`),
    getStudentGrievances: (params) => apiClient.get('/student/grievances', { params }),
    getStudentGrievanceById: (id) => apiClient.get(`/student/grievances/${id}`),
    
    // Authority
    getAssignedGrievances: (params) => apiClient.get('/authority/grievances', { params }),
    getAuthorityGrievanceById: (id) => apiClient.get(`/authority/grievances/${id}`),
    updateStatus: (id, data) => apiClient.patch(`/authority/grievances/${id}/status`, data),
    escalateManual: (id, data) => apiClient.post(`/authority/grievances/${id}/escalate`, data),

    // Admin
    getAllGrievances: (params) => apiClient.get('/admin/grievances', { params }),
    getAdminGrievanceById: (id) => apiClient.get(`/admin/grievances/${id}`),
    overrideGrievance: (id, data) => apiClient.patch(`/admin/grievances/${id}/override`, data),
  },

  // Hierarchy
  hierarchy: {
    getConfig: () => apiClient.get('/hierarchy'),
    getCategoryHierarchy: (category) => apiClient.get(`/hierarchy/${category}`),
    updateCategoryHierarchy: (category, levels) => apiClient.put(`/hierarchy/${category}`, { levels }),
  },

  // Analytics
  analytics: {
    getOverview: () => apiClient.get('/analytics/overview'),
    getCategoryStats: () => apiClient.get('/analytics/categories'),
    getDepartmentPerformance: () => apiClient.get('/analytics/departments'),
  },

  // Notifications
  notifications: {
    getAll: () => apiClient.get('/notifications'),
    markAsRead: (id) => apiClient.patch(`/notifications/${id}/read`),
    markAllAsRead: () => apiClient.patch('/notifications/read-all'),
  },
};

export default api;
