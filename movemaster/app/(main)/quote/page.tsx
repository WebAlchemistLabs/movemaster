import type { Metadata } from 'next';
import QuoteWizard from '@/components/quote/QuoteWizard';

export const metadata: Metadata = {
  title: 'Get a Free Moving Quote',
  description: 'Get a free, instant moving quote from MoveMaster Pro. 5-minute process with real-time price estimation for all Southern Ontario moves.',
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-primary text-xs font-mono tracking-widest uppercase">Free & No Obligation</span>
          <h1 className="font-heading text-4xl sm:text-5xl text-white mt-2 mb-3">GET YOUR FREE QUOTE</h1>
          <p className="text-text-muted">Takes about 5 minutes. We will call you within 2 hours to confirm.</p>
        </div>
        <QuoteWizard />
      </div>
    </div>
  );
}
