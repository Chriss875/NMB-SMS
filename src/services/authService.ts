import axios from 'axios';
import { api } from './api'; // Import the shared API instance

// Type definitions for auth data
export interface SignupData {
  email: string;
  password?: string;
  confirmPassword?: string; // Make this optional
  token?: string; // Add the token field
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
      console.log('Attempting login with:', { email });
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response);
      
      // Return the data which should already include the user object
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: SignupData) => {
    try {
      console.log('Registering user:', userData.email);
      // This should match the /signup/initial endpoint
      const response = await api.post('/auth/signup/initial', {
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword || userData.password,
        token: userData.token // Make sure to include the token
      });
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

  // Verify email with the token provided physically
  verifyEmail: async (email: string, token: string) => {
    try {
      console.log('Verifying email:', email, 'with token');
      
      // Call the initial signup endpoint with just email and token
      const response = await api.post('/auth/signup/initial', { 
        email, 
        token 
      });
      
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  },

  // Set password after verification
  setPassword: async (email: string, password: string) => {
    try {
      console.log('Setting password for:', email);
      const response = await api.post('/auth/signup/set-password', {
        email,
        password,
      });
      
      return response.data;
    } catch (error) {
      console.error('Set password error:', error);
      throw error;
    }
  },

  // For backward compatibility
  requestVerificationCode: async () => {
    try {
      console.log('This function is deprecated in the new flow');
      // In the new flow, we don't need to request verification code
      return { success: true, message: "Verification code would be sent" };
    } catch (error: unknown) {
      // Type-safe error handling
      console.error('This function should not be used in the new flow');
      throw new Error('This function is deprecated in the new flow');
    }
  },

  completeProfile: async (profileData: ProfileData) => {
    try {
      // Validate email presence
      if (!profileData.email || profileData.email.trim() === '') {
        console.error('Email validation failed:', {
          emailValue: profileData.email,
          profileData
        });
        throw new Error('Email is required but missing or empty');
      }
      
      console.log('Completing profile for:', profileData.email);
      
      // This should match /signup/complete endpoint
      const response = await api.post('/auth/signup/complete', profileData);
      return response.data;
    } catch (error) {
      console.error('Profile completion error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      // Use the profile endpoint since /auth/me doesn't exist
      const response = await api.get('/profile');
      return {
        id: response.data.id?.toString(),
        email: response.data.email,
        name: response.data.name,
        role: response.data.role || 'user'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  resetPassword: async (email: string, newPassword: string) => {
    try {
      console.log('Resetting password for:', email);
      const response = await api.post('/auth/reset-password', null, {
        params: {
          email,
          newPassword
        }
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }
};

export default authService;