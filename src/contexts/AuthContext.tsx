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
  
  // Update the login function to properly store the token
const login = async (email: string, password: string) => {
  setIsLoading(true);
  setError(null);
  try {
    console.log('Attempting login in AuthContext');
    const response = await authService.login({ email, password });
    console.log('Login successful, response:', response);
    
    // Check if response has loginResponseDTO
    if (response && response.loginResponseDTO) {
      // Create a user object from the loginResponseDTO
      const userData = {
        id: response.loginResponseDTO.id.toString(),
        name: response.loginResponseDTO.name || '', 
        email: response.loginResponseDTO.email,
        role: response.loginResponseDTO.role || 'user'
      };
      
      // Set user in state
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Store token consistently as 'authToken' - IMPORTANT: Verify this exact format
      if (response.loginResponseDTO.token) {
        console.log('Storing auth token to localStorage:', response.loginResponseDTO.token.substring(0, 10) + '...');
        localStorage.setItem('authToken', response.loginResponseDTO.token);
      } else {
        console.error('No token received in login response!', response);
        throw new Error('No authentication token received from server');
      }
    } else {
      console.error('Login response invalid format:', response);
      throw new Error('Invalid response format from server');
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
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        console.log('Checking auth on app mount:', { 
          hasUser: !!storedUser, 
          hasToken: !!token 
        });
        
        if (!storedUser || !token) {
          console.log('No stored user or token found');
          setIsLoading(false);
          return;
        }
        
        try {
          // Use a simpler approach to verify the token
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Optional: Make an API call to validate the token
          // but don't block the UI on this
          authService.getCurrentUser()
            .then(() => {
              console.log('Token validated via API');
            })
            .catch((err) => {
              console.error('Token validation failed:', err);
              // Only clear if it's an auth error
              if (err?.response?.status === 401) {
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('authToken');
              }
            });
        } catch (parseErr) {
          console.error('Error parsing stored user:', parseErr);
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('Error in checkAuth:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    // Listen for session expiration events
    const handleSessionExpired = (event: CustomEvent) => {
      setUser(null);
      setError(event.detail.message);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    };

    window.addEventListener('sessionExpired', handleSessionExpired as EventListener);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired as EventListener);
    };
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