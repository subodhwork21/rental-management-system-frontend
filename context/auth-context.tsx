'use client';

import { authAPI, tokenManager } from '@/lib/auth';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role?: string) => Promise<{ success: boolean; message: string; errors?: any }>;
  register: (userData: any) => Promise<{ success: boolean; message: string; errors?: any }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const savedToken = tokenManager.getToken();
    const savedUser = tokenManager.getUser();

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    try {
      const response = await authAPI.login(email, password, role);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        tokenManager.setToken(token);
        tokenManager.setUser(user);
        
        return { success: true, message: response.message };
      } else {
        return { 
          success: false, 
          message: response.message || 'Login failed',
          errors: response.errors 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        setUser(user);
        setToken(token);
        tokenManager.setToken(token);
        tokenManager.setUser(user);
        
        return { success: true, message: response.message };
      } else {
        return { 
          success: false, 
          message: response.message || 'Registration failed',
          errors: response.errors 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      tokenManager.removeToken();
      tokenManager.removeUser();
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
