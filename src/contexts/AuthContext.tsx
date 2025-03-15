import React, { createContext, useState, useEffect, ReactNode } from 'react';
import authService, { ProfileData, SignupData } from '../services/authService';
import { ROUTES } from '@/constants/routes';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  signupData: SignupData | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: SignupData) => Promise<string>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  requestVerificationCode: (email: string) => Promise<void>;
  completeProfile: (profileData: ProfileData) => Promise<void>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  signupData: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  register: async () => "",
  verifyEmail: async () => {},
  requestVerificationCode: async () => {},
  completeProfile: async () => {},
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generic error handler

  // Login function using real API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      
      // JWT cookie is handled by the browser automatically
      // Only save user data
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function using real API
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      // Clear local state
      setUser(null);
      localStorage.removeItem('user');
      setIsLoading(false);
    }
  };

  // Register function using real API
  const register = async (userData: SignupData) => {
    setIsLoading(true);
    setError(null);
    try {
      setSignupData(userData);
      
      // Return a redirect path instead of just a message
      return ROUTES.VERIFY_EMAIL;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email function using real API
  const verifyEmail = async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Verifying email:', email, 'with code:', code);
      
      // Fix: Pass separate parameters properly as an object
      await authService.verifyEmail({ 
        email: email, 
        code: code 
      });
      
      console.log('Verification successful');
    } catch (err: any) {
      console.error('Verification error in AuthContext:', err);
      let errorMessage = 'An error occurred during verification';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Request verification code function using real API
  const requestVerificationCode = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.requestVerificationCode(email);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred requesting a new code';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete profile function using real API
  const completeProfile = async (profileData: ProfileData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Completing profile with data:', profileData);
      
      // Make sure we're not missing email
      if (!profileData.email) {
        throw new Error('Email is required but missing');
      }
      
      const response = await authService.completeProfile(profileData);
      console.log('Profile completion response:', response);
      
      return response;
    } catch (err: any) {
      console.error('Error in completeProfile:', err);
      const errorMessage = err.response?.data || 'An error occurred completing your profile';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check for existing user on mount and validate token
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (!storedUser) {
        return;
      }
      
      try {
        setIsLoading(true);
        // Verify the token is still valid by getting current user
        // Cookie will be sent automatically
        const response = await authService.getCurrentUser();
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      } catch (err) {
        // If there's an error, token is likely invalid
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        signupData,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        verifyEmail,
        requestVerificationCode,
        completeProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Use the existing hook
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};