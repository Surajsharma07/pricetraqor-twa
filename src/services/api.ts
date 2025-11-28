/**
 * API Client for FastAPI Backend
 * Configured with axios interceptors for JWT authentication
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
      // Could emit event here for app to handle
      console.error('Unauthorized - token may have expired');
    }
    
    if (error.response?.status === 403) {
      console.error('Forbidden - insufficient permissions');
    }
    
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
