import React, { createContext, useState, useEffect, ReactNode } from 'react';
import authService, { ProfileData, SignupData } from '../services/authService';

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
  verifyEmail: (email: string, token: string) => Promise<void>;
  setPassword: (email: string, password: string) => Promise<void>;
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
  verifyEmail: async () => {},
  setPassword: async () => {},
  completeProfile: async () => {},
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage on component mount
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [signupData] = useState<SignupData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to prevent flash of unauthenticated state
  const [error, setError] = useState<string | null>(null);
  
  // Login function 
const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Attempting login in AuthContext');
      const response = await authService.login({ email, password });
      console.log('Login successful, response:', response);
      
      // Check if response has loginResponseDTO
      if (response.loginResponseDTO) {
        // Create a user object from the loginResponseDTO
        const userData = {
          id: response.loginResponseDTO.id.toString(),
          name: response.loginResponseDTO.name || '', // Use name if available 
          email: response.loginResponseDTO.email,
          role: response.loginResponseDTO.role || 'user' // Default to 'user' if role is null
        };
        
        // Set user in state
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Store token consistently as 'authToken'
        if (response.loginResponseDTO.token) {
          localStorage.setItem('authToken', response.loginResponseDTO.token);
        }
      } else {
        // Fallback in case loginResponseDTO is missing
        console.error('Login response missing loginResponseDTO:', response);
        throw new Error('Invalid response format: missing user data');
      }
    } catch (err: any) {
      console.error('Login error in AuthContext:', err);
      const errorMessage = err.response?.data?.message || 'An error occurred during login';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the logout function to clear all auth data
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      // Clear local state and storage
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken'); // Clear token consistently
      setIsLoading(false);
    }
  };

  // Verify email function - using the provided token
  const verifyEmail = async (email: string, token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the verify email endpoint with the email and token
      const response = await authService.verifyEmail(email, token);
      
      // Store verified email for the next step
      sessionStorage.setItem('verifiedEmail', email);
      
      return response;
    } catch (err: any) {
      console.error('Verification error in AuthContext:', err);
      let errorMessage = 'An error occurred during verification';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Set password function - for creating password after email verification
  const setPassword = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Call the set password endpoint
      await authService.setPassword(email, password);
      
      console.log('Password set successfully for:', email);
    } catch (err: any) {
      console.error('Error setting password:', err);
      // More specific error message based on error type
      let errorMessage = 'An error occurred setting your password';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete profile function
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
  
  // Update the auth check useEffect to properly verify authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');
      
      if (!storedUser || !token) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // Verify the token is still valid by getting current user
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          // If we get a valid response, update the user state
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        // If there's an error, token is likely invalid
        console.error('Error validating authentication:', err);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
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
        verifyEmail,
        setPassword,
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