'use client';

import React, { createContext, useContext, useState } from 'react';
import type { ServiceType, MoveSize } from '@/types';

export interface QuoteFormData {
  moveSize: MoveSize | '';
  serviceType: ServiceType | '';
  moveDate: string;
  flexibleDates: boolean;
  originAddress: string;
  originCity: string;
  destinationAddress: string;
  destinationCity: string;
  floorOrigin: number;
  floorDestination: number;
  hasElevator: boolean;
  needsPacking: boolean;
  needsStorage: boolean;
  hasSpecialtyItems: boolean;
  specialtyDetails: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
  hearAboutUs: string;
}

const defaultForm: QuoteFormData = {
  moveSize: '',
  serviceType: '',
  moveDate: '',
  flexibleDates: false,
  originAddress: '',
  originCity: '',
  destinationAddress: '',
  destinationCity: '',
  floorOrigin: 1,
  floorDestination: 1,
  hasElevator: false,
  needsPacking: false,
  needsStorage: false,
  hasSpecialtyItems: false,
  specialtyDetails: '',
  notes: '',
  name: '',
  email: '',
  phone: '',
  hearAboutUs: '',
};

interface QuoteContextType {
  step: number;
  formData: QuoteFormData;
  setStep: (s: number) => void;
  updateForm: (data: Partial<QuoteFormData>) => void;
  resetForm: () => void;
  submittedQuoteId: string | null;
  setSubmittedQuoteId: (id: string | null) => void;
}

const QuoteContext = createContext<QuoteContextType | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>(defaultForm);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  function updateForm(data: Partial<QuoteFormData>) {
    setFormData((prev) => ({ ...prev, ...data }));
  }

  function resetForm() {
    setFormData(defaultForm);
    setStep(1);
    setSubmittedQuoteId(null);
  }

  return (
    <QuoteContext.Provider value={{ step, formData, setStep, updateForm, resetForm, submittedQuoteId, setSubmittedQuoteId }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider');
  return ctx;
}
