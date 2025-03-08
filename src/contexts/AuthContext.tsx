import React, { createContext, useState, useEffect, ReactNode } from 'react';

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

// For now, use a mock implementation
export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [signupData, setSignupData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For development, accept any credentials with valid format
      // In production, this would validate against the backend
      if (email.includes('@') && password.length >= 6) {
        // Get name from profile data if available
        let name = email.split('@')[0]; // Default name from email
        
        try {
          const storedProfileData = localStorage.getItem('profileData');
          if (storedProfileData) {
            const profileData = JSON.parse(storedProfileData);
            if (profileData.email === email) {
              name = profileData.name;
            }
          }
        } catch (e) {
          console.error("Error parsing profile data:", e);
        }
        
        const mockUser = {
          id: '1',
          name: name,
          email: email,
          role: 'student'
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setError(null);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mock logout function
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Mock register function
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setSignupData(userData);
      setError(null);
      return "Registration successful";
    } catch (err) {
      setError('An error occurred during registration');
      return "Registration failed";
    } finally {
      setIsLoading(false);
    }
  };

  // Mock verification function
  const verifyEmail = async (_email: string, code: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, you'd validate the code with your backend
      if (code === '123456' || code === '000000') { // Demo codes
        setError(null);
        return;
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock request new code function
  const requestVerificationCode = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setError(null);
    } catch (err) {
      setError('An error occurred requesting a new code');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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