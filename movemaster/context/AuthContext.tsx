'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserProfile } from '@/types';
import { onAuthChange, loginUser, registerUser, logoutUser, DEMO_USER } from '@/firebase/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function login(email: string, password: string) {
    await loginUser(email, password);
  }

  async function register(email: string, password: string, name: string) {
    await registerUser(email, password, name);
  }

  async function logout() {
    await logoutUser();
  }

  async function demoLogin() {
    await loginUser(DEMO_USER.email, 'demo');
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
