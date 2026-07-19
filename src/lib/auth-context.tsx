'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from './axios';
import { AuthUser } from '@/types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('studyco_token');
    const storedUser = localStorage.getItem('studyco_user');
    if (stored && storedUser) {
      setToken(stored);
      setUser(JSON.parse(storedUser));
      // Revalidate in the background; log out if the token no longer works.
      api
        .get('/auth/me')
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem('studyco_token');
          localStorage.removeItem('studyco_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback((newToken: string, newUser: AuthUser) => {
    localStorage.setItem('studyco_token', newToken);
    localStorage.setItem('studyco_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('studyco_token');
    localStorage.removeItem('studyco_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
