import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, profileAPI } from '../lib/api';
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

  const loadUser = async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser(data);
      setProfile(data);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await authAPI.login({ email, password });
    setUser(data.user);
    setProfile(data.user);
  };

  const register = async (email: string, password: string, fullName: string, role?: string) => {
    console.log('=== AuthContext register called ===');
    console.log('Email:', email);
    console.log('Full name:', fullName);
    console.log('Role:', role);

    try {
      console.log('Making API call to /auth/register...');
      const { data } = await authAPI.register({ email, password, full_name: fullName, role });
      console.log('API call successful, response:', data);
      setUser(data.user);
      setProfile(data.user);
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
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
