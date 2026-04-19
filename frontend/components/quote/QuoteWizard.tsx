'use client';

import { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import StepProgress from '@/components/ui/StepProgress';
import Step1MoveDetails from './Step1MoveDetails';
import Step2Locations from './Step2Locations';
import Step3AddOns from './Step3AddOns';
import Step4ContactInfo from './Step4ContactInfo';
import Step5Review from './Step5Review';
import { CheckCircle, Copy } from 'lucide-react';
import Link from 'next/link';

const STEP_LABELS = ['Move Details', 'Locations', 'Add-Ons', 'Your Info', 'Review'];

export default function QuoteWizard() {
  const { step, submittedQuoteId: submittedId, resetForm } = useQuote();

  if (submittedId) {
    return (
      <div className="card-dark p-10 text-center animate-fade-in">
        <div className="w-16 h-16 bg-green-900/40 border border-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="font-heading text-white text-3xl mb-2 tracking-wide">QUOTE SUBMITTED!</h2>
        <p className="text-text-muted mb-6">
          We have received your quote request and will call you within 2 hours to confirm details and answer any questions.
        </p>
        <div className="bg-bg border border-border rounded-xl p-5 mb-8 inline-block">
          <p className="text-text-muted text-xs mb-1">Your Confirmation Number</p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-primary text-2xl font-bold tracking-widest">{submittedId}</span>
            <button
              onClick={() => navigator.clipboard?.writeText(submittedId)}
              className="text-text-muted hover:text-white transition-colors"
              title="Copy"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-text-muted text-sm">What happens next:</p>
          <div className="text-left space-y-2 max-w-xs mx-auto">
            {['Our coordinator calls within 2 hours', 'We confirm your move details', 'Pay 20% deposit to secure your date', 'Receive your final booking confirmation'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-text-muted">
                <span className="w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs shrink-0">{i + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-center mt-8">
          <button onClick={resetForm} className="btn-outline text-sm">
            Submit Another Quote
          </button>
          <Link href="/" className="btn-primary text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card-dark p-6 sm:p-8">
      <div className="mb-8">
        <StepProgress steps={STEP_LABELS} current={step} />
      </div>
      {step === 1 && <Step1MoveDetails />}
      {step === 2 && <Step2Locations />}
      {step === 3 && <Step3AddOns />}
      {step === 4 && <Step4ContactInfo />}
      {step === 5 && <Step5Review />}
    </div>
  );
}
