import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  signupData: any | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<string>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  requestVerificationCode: (email: string) => Promise<void>;
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
});

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [signupData, setSignupData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true to check auth on mount
  const [error, setError] = useState<string | null>(null);
  
  // Real login function using authService
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Set user
      setUser(response.user);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Real logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - implement with API
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // Replace with actual API call when implemented
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      setSignupData(userData);
      setError(null);
      return "Registration successful";
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during registration';
      setError(errorMessage);
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  // Email verification function - implement with API
  const verifyEmail = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      // Replace with actual API call when implemented
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  // Request verification code function
  const requestVerificationCode = async (email: string) => {
    setIsLoading(true);
    try {
      // Replace with actual API call when implemented
      const response = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to request verification code');
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.message || 'An error occurred requesting a new code');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check for existing user on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Validate token by getting current user
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          setUser(currentUser);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
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
        requestVerificationCode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Add a hook for easy access
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};