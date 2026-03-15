import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ApiAuthResponse, ApiUser, AuthState } from '../types';
import { apiRequest } from '../utils/api';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'habitwork_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useCallback((authToken: string, authUser: ApiUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem(TOKEN_KEY, authToken);
  }, []);

  const clearAuth = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  const refresh = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const me = await apiRequest<ApiUser>('/auth/me', { token });
      setUser(me);
    } catch (err) {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [token, clearAuth]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      const result = await apiRequest<ApiAuthResponse>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setAuth(result.token, result.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setAuth]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    try {
      setLoading(true);
      const result = await apiRequest<ApiAuthResponse>('/auth/register', {
        method: 'POST',
        body: { name, email, password },
      });
      setAuth(result.token, result.user);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setAuth]);

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    refresh,
  }), [user, token, loading, error, login, register, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
