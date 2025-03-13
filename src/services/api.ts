/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_API_URL?: string;
    // Add other environment variables you use
    readonly [key: string]: any;
  };
}

import axios, { AxiosInstance, AxiosError } from 'axios';

// Base API setup
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth tokens, etc.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Validate that the response contains valid JSON data when expected
    if (response.data === '' && response.headers['content-type']?.includes('application/json')) {
      console.warn('Empty JSON response received when JSON was expected');
      // Return an empty object instead of empty string to prevent parsing errors
      return { ...response, data: {} };
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear token if it's unauthorized
      localStorage.removeItem('token');
      
      // Redirect to login if not already there 
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Handle JSON parsing errors specifically
    if (error.message === 'Unexpected end of JSON input' || 
        error.message.includes('JSON')) {
      console.error('JSON parsing error:', error.message);
      
      // Log what endpoint caused this error for debugging
      console.error('Failed endpoint:', {
        url: error.config?.url,
        method: error.config?.method
      });
      
      // Return a more user-friendly error
      return Promise.reject(new Error('The server returned an invalid response. Please try again later.'));
    }
    
    // Log all API errors for debugging
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    return Promise.reject(error);
  }
);

export { api };
