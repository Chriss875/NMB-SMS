import axios from 'axios';
import { api } from './api'; // Import the shared API instance


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Type definitions for auth data
export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string; // Remove the '?' to make it required
}

export interface ProfileData {
  name: string;
  email: string;
  mobilePhone: string;
  universityName: string;
  universityRegistrationID: string;
  programName: string;
  enrolledYear: string;
  batchNumber: number;
  sex: string;
  enrollmentStatus: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create default export for authService
const authService = {
  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      console.log('Attempting login with:', { email, urlUsed: `${API_URL}/auth/login` });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response);
      return response.data;
    } catch (error: unknown) {
      // Type-safe error handling
      if (axios.isAxiosError(error) && error.response) {
        console.error('Login error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else if (error instanceof Error) {
        console.error('Login error:', error.message);
      } else {
        console.error('Unknown login error occurred');
      }
      throw error;
    }
  },

  register: async (userData: SignupData) => {
    try {
      console.log('Registering user:', userData.email);
      const response = await api.post('/auth/signup/initial', userData);
      return response.data;
    } catch (error: unknown) {
      // Type-safe error handling
      if (axios.isAxiosError(error) && error.response) {
        console.error('Registration error details:', error.response.data);
      } else if (error instanceof Error) {
        console.error('Registration error:', error.message);
      } else {
        console.error('Unknown registration error occurred');
      }
      throw error;
    }
  },

  verifyEmail: async (emailOrParams: string | { email: string; code: string }, code?: string) => {
    try {
      let email: string;
      let verificationCode: string;

      // Handle both parameter styles (object or separate parameters)
      if (typeof emailOrParams === 'string' && code) {
        // Called with separate parameters: verifyEmail(email, code)
        email = emailOrParams;
        verificationCode = code;
      } else if (typeof emailOrParams === 'object' && 'email' in emailOrParams && 'code' in emailOrParams) {
        // Called with object parameter: verifyEmail({ email, code })
        email = emailOrParams.email;
        verificationCode = emailOrParams.code;
      } else {
        throw new Error('Invalid parameters for email verification');
      }

      console.log('Verifying email with code for:', email, 'Code:', verificationCode);
      
      // IMPORTANT: The backend expects form parameters (not JSON)
      const formData = new URLSearchParams();
      formData.append('email', email.trim());
      formData.append('token', verificationCode.trim()); // Backend expects 'token', not 'code'
      
      console.log('Sending verification with form data:', Object.fromEntries(formData.entries()));
      
      const response = await api.post('/auth/signup/verify-token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data;
    } catch (error: unknown) {
      // Type-safe error handling
      if (axios.isAxiosError(error) && error.response) {
        console.error('API error details:', error.response.data);
        
        // Check for specific API error messages
        if (error.response.data === "Invalid token") {
          throw new Error('The verification code is invalid or expired. Please request a new code.');
        }
        
        // Generic error message for other cases
        throw new Error(
          typeof error.response.data === 'string' 
            ? error.response.data 
            : error.response.data?.message || 'Verification failed. Please try again.'
        );
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
        throw error;
      } else {
        console.error('Unknown error occurred');
        throw new Error('Verification failed. Please try again.');
      }
    }
  },

  requestVerificationCode: async (email: string) => {
    try {
      console.log('Requesting verification code for:', email);
      
      // Send as form data to match backend expectations
      const formData = new URLSearchParams();
      formData.append('email', email.trim());
      
      const response = await api.post('/auth/request-verification', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data;
    } catch (error: unknown) {
      // Type-safe error handling
      if (axios.isAxiosError(error) && error.response) {
        console.error('API error details:', error.response.data);
        
        // Return user-friendly error message
        if (typeof error.response.data === 'string') {
          throw new Error(error.response.data);
        } else if (error.response.data?.message) {
          throw new Error(error.response.data.message);
        }
      }
      
      throw new Error('Failed to request verification code. Please try again.');
    }
  },

  completeProfile: async (profileData: ProfileData) => {
    try {
      // Validate email presence with better logging
      if (!profileData.email || profileData.email.trim() === '') {
        console.error('Email validation failed:', {
          emailValue: profileData.email,
          profileData
        });
        throw new Error('Email is required but missing or empty');
      }
      
      console.log('Sending complete profile request with email:', profileData.email);
      
      // Copy data to ensure email is included
      const dataToSend = {
        ...profileData,
        email: profileData.email.trim() // Ensure no whitespace
      };
      
      const response = await api.post('/auth/signup/complete', dataToSend);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Profile completion error details:', error.response.data);
      } else if (error instanceof Error) {
        console.error('Profile completion error:', error);
      } else {
        console.error('Unknown error during profile completion');
      }
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: unknown) {
      // Type-safe error handling
      if (axios.isAxiosError(error) && error.response) {
        console.error('API error details:', error.response.data);
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error occurred');
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error: unknown) {
      // Type-safe error handling
      if (axios.isAxiosError(error) && error.response) {
        console.error('API error details:', error.response.data);
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error occurred');
      }
    }
  },
  
  resetPassword: async (email: string, newPassword: string) => {
    try {
      console.log('Resetting password for:', email);
      const response = await api.post('/auth/reset-password', { email, newPassword });
      return response.data;
    } catch (error: unknown) {
      // Type-safe error handling
      if (axios.isAxiosError(error) && error.response) {
        console.error('API error details:', error.response.data);
      } else if (error instanceof Error) {
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error occurred');
      }
      throw error;
    }
  }
};

export default authService;