'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '@/types';
import { authApi, isApiEnabled } from '@/lib/api';
import { onAuthChange, loginUser, registerUser, logoutUser, DEMO_USER } from '@/firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  userRole: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toProfile(u: { uid: string; displayName: string; email: string }): UserProfile {
  return { uid: u.uid, displayName: u.displayName, email: u.email, createdAt: new Date().toISOString() };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]         = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (isApiEnabled) {
      const token = localStorage.getItem('mm_access_token');
      if (token) {
        authApi.getMe()
          .then((u) => {
            setUser(toProfile(u));
            setUserRole((u as { role?: string }).role ?? 'customer');
          })
          .catch(() => {
            localStorage.removeItem('mm_access_token');
            localStorage.removeItem('mm_refresh_token');
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    } else {
      const unsub = onAuthChange((u) => {
        setUser(u);
        setUserRole(u ? 'customer' : null);
        setLoading(false);
      });
      return unsub;
    }
  }, []);

  async function login(email: string, password: string) {
    if (isApiEnabled) {
      const data = await authApi.login(email, password);
      setUser(toProfile(data.user));
      setUserRole((data.user as { role?: string }).role ?? 'customer');
    } else {
      await loginUser(email, password);
      setUserRole('customer');
    }
  }

  async function register(email: string, password: string, name: string) {
    if (isApiEnabled) {
      const data = await authApi.register(name, email, password);
      setUser(toProfile(data.user));
      setUserRole('customer');
    } else {
      await registerUser(email, password, name);
      setUserRole('customer');
    }
  }

  async function logout() {
    if (isApiEnabled) authApi.logout(); else await logoutUser();
    setUser(null);
    setUserRole(null);
  }

  async function demoLogin() {
    if (isApiEnabled) {
      const data = await authApi.demoLogin();
      setUser(toProfile(data.user));
      setUserRole((data.user as { role?: string }).role ?? 'customer');
    } else {
      await loginUser(DEMO_USER.email, 'demo');
      setUserRole('customer');
    }
  }

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
