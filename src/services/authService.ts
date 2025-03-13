import { api } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('api/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('api/auth/signup/complete', userData);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    // Clear token on server if needed
    await api.post('/auth/logout');
    localStorage.removeItem('token');
  },
  
//   getCurrentUser: async (): Promise<AuthResponse['user'] | null> => {
//     try {
//       const response = await api.get('/auth/me');
//       return response.data;
//     } catch {
//       return null;
//     }
//   },

  verifyEmail: async (email: string, token: string): Promise<void> => {
    await api.post('api/auth/signup/verify-token', { email, token });
  },

  requestVerificationCode: async (email: string): Promise<void> => {
    await api.post('/auth/request-code', { email });
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
}