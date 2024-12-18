import { create } from 'zustand';
import { AuthResponse, User } from '../types/auth';
import api from '../lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  initialize: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      set({
        user,
        token,
        isAuthenticated: true,
      });
    }
  },
  
  login: async (email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
      });
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

// Initialize auth state when the store is created
useAuthStore.getState().initialize();