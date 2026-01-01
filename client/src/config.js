// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    ME: `${API_BASE_URL}/api/auth/me`,
  },
  INCIDENTS: `${API_BASE_URL}/api/incidents`,
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
  COMMENTS: `${API_BASE_URL}/api/comments`,
  STATS: `${API_BASE_URL}/api/stats`,
};
