import { create } from 'zustand';
import { authService } from '../services/api';
import { User, UserRole, LoginRequest, RegisterRequest } from '../types/user';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  userRole: null,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      set({ 
        user, 
        isAuthenticated: true, 
        userRole: user.role, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Login failed' 
      });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      const { token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      set({ 
        user, 
        isAuthenticated: true, 
        userRole: user.role, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.response?.data?.message || 'Registration failed' 
      });
      throw error;
    }
  },

  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    set({ 
      user: null, 
      isAuthenticated: false, 
      userRole: null 
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        userRole: null 
      });
      return;
    }
    
    set({ isLoading: true });
    try {
      const response = await authService.getProfile();
      const { user } = response.data;
      
      set({ 
        user, 
        isAuthenticated: true, 
        userRole: user.role, 
        isLoading: false 
      });
    } catch (error) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      set({ 
        user: null, 
        isAuthenticated: false, 
        userRole: null, 
        isLoading: false 
      });
    }
  },
}));
