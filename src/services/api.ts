import axios from 'axios';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || '/api'; // Updated to use relative path
console.log('API service using URL:', API_URL);

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies
});

// Add token to all requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add this to your API configuration
api.interceptors.request.use(
  (config) => {
    console.log('Outgoing request:', { 
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle common error cases
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
  (error) => {
    // Handle unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
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
