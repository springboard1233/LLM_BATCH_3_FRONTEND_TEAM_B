import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiService } from '../services/api';
import type { User, Profile } from '../lib/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  login: async () => { },
  register: async () => { },
  logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    // Simple auth - load user from localStorage
    try {
      const storedUser = apiService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        setProfile(storedUser);
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await apiService.loginRequest({ email, password });
    if (data.user) {
      setUser(data.user);
      setProfile(data.user);
    }
  };

  const register = async (email: string, password: string, fullName: string, role?: string) => {
    console.log('=== AuthContext register called ===');
    console.log('Email:', email);
    console.log('Full name:', fullName);
    console.log('Role:', role);

    try {
      console.log('Making API call to /auth/register...');
      const data = await apiService.signupRequest({ 
        name: fullName, 
        email, 
        password 
      });
      console.log('API call successful, response:', data);
      if (data.user) {
        setUser(data.user);
        setProfile(data.user);
      }
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
