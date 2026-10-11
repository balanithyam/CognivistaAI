import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CognitiveProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  profile: CognitiveProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (usernameOrEmail: string, password: string) => Promise<boolean>;
  register: (payload: { email: string; username: string; password: string; full_name?: string }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfileState: (partial: Partial<CognitiveProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CognitiveProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const data = await api.getMe();
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        full_name: data.full_name,
        settings: data.settings,
      });
      setProfile(data.profile);
      setError(null);
    } catch {
      api.clearToken();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('cognivista_token');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }

    const handleUnauthorized = () => {
      setUser(null);
      setProfile(null);
    };

    window.addEventListener('cognivista_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('cognivista_unauthorized', handleUnauthorized);
  }, []);

  const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.login({ username_or_email: usernameOrEmail, password });
      setUser({
        id: res.user.id,
        username: res.user.username,
        email: res.user.email,
        full_name: res.user.full_name,
      });
      // Fetch full profile
      await fetchCurrentUser();
      return true;
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { email: string; username: string; password: string; full_name?: string }) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.register(payload);
      return res;
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    try {
      const p = await api.getProfile();
      setProfile(p);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  const updateProfileState = (partial: Partial<CognitiveProfile>) => {
    setProfile((prev) => (prev ? { ...prev, ...partial } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshProfile,
        updateProfileState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
