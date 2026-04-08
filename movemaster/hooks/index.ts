'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Review, ServiceType, QuoteInput, QuoteResult } from '@/types';
import { calculateQuote } from '@/lib/utils';

export function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
  return scrolled;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch { return initial; }
  });

  const set = useCallback((v: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(next));
      }
      return next;
    });
  }, [key]);

  return [value, set] as const;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface Toast { id: string; message: string; type: ToastType; }

let toastListeners: Array<(t: Toast) => void> = [];

export function useToast() {
  const show = useCallback((message: string, type: ToastType = 'info') => {
    const toast: Toast = { id: Date.now().toString(), message, type };
    toastListeners.forEach((l) => l(toast));
  }, []);
  return { success: (m: string) => show(m, 'success'), error: (m: string) => show(m, 'error'), info: (m: string) => show(m, 'info'), warning: (m: string) => show(m, 'warning') };
}

export function useToastStore() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 4000);
    };
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter((l) => l !== listener); };
  }, []);
  const remove = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  return { toasts, remove };
}

export function useReviews(filters?: { serviceType?: ServiceType; city?: string; minRating?: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  useEffect(() => {
    import('@/data').then(({ reviews: all }) => {
      let filtered = [...all];
      if (filters?.serviceType) filtered = filtered.filter((r) => r.serviceType === filters.serviceType);
      if (filters?.city) filtered = filtered.filter((r) => r.originCity === filters.city || r.destinationCity === filters.city);
      if (filters?.minRating) filtered = filtered.filter((r) => r.rating >= (filters.minRating ?? 0));
      setReviews(filtered);
    });
  }, [filters?.serviceType, filters?.city, filters?.minRating]);
  return reviews;
}

export function useQuoteCalculator(input: Partial<QuoteInput>): QuoteResult | null {
  const [result, setResult] = useState<QuoteResult | null>(null);
  useEffect(() => {
    if (!input.moveSize || !input.serviceType) { setResult(null); return; }
    const full: QuoteInput = {
      serviceType: input.serviceType!,
      moveSize: input.moveSize!,
      originCity: input.originCity ?? '',
      destinationCity: input.destinationCity ?? '',
      needsPacking: input.needsPacking ?? false,
      needsStorage: input.needsStorage ?? false,
      hasSpecialtyItems: input.hasSpecialtyItems ?? false,
      floorOrigin: input.floorOrigin ?? 1,
      floorDestination: input.floorDestination ?? 1,
      hasElevator: input.hasElevator ?? true,
    };
    setResult(calculateQuote(full));
  }, [input.moveSize, input.serviceType, input.originCity, input.destinationCity, input.needsPacking, input.needsStorage, input.hasSpecialtyItems, input.floorOrigin, input.floorDestination, input.hasElevator]);
  return result;
}
