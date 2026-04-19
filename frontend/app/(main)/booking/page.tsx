'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, CheckCircle, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatCurrency, generateId } from '@/lib/utils';
import { useToast } from '@/hooks';
import { markDepositPaid } from '@/firebase/firestore';
import type { QuoteRequest } from '@/types';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const quoteId = searchParams.get('quoteId') ?? '';

  const [quote, setQuote] = useState<QuoteRequest | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [confirmRef] = useState('BK-' + generateId());

  useEffect(() => {
    if (!quoteId) return;
    const quotes: QuoteRequest[] = JSON.parse(localStorage.getItem('mm_quotes') ?? '[]');
    const found = quotes.find((q) => q.id === quoteId);
    setQuote(found ?? null);
  }, [quoteId]);

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    if (quoteId) await markDepositPaid(quoteId);
    setPaid(true);
    setPaying(false);
    toast.success('Deposit paid! Your move is confirmed.');
  }

  const depositAmount = quote?.depositAmount ?? 200;

  if (paid) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="bg-surface border border-border rounded-2xl p-10">
          <div className="w-16 h-16 bg-green-900/40 border border-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h1 className="font-heading text-3xl text-white mb-2">BOOKING CONFIRMED!</h1>
          <p className="text-text-muted mb-6">Your deposit of {formatCurrency(depositAmount)} has been processed. Your move is officially booked.</p>
          <div className="bg-bg border border-border rounded-xl p-5 mb-8">
            <p className="text-text-muted text-xs mb-1">Booking Reference</p>
            <p className="font-mono text-primary text-2xl tracking-widest">{confirmRef}</p>
          </div>
          <div className="text-left space-y-2 mb-8">
            {[
              'Coordinator will contact you 48 hours before your move',
              'Crew arrives at your confirmed time window',
              'Remaining balance due on move completion',
              'You will receive a confirmation email shortly',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-text-muted">
                <CheckCircle size={14} className="text-primary shrink-0" /> {item}
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/dashboard')} className="btn-primary w-full py-3">
            View in Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
      <div className="text-center mb-10">
        <p className="text-primary font-mono text-xs tracking-widest uppercase mb-2">Secure Your Date</p>
        <h1 className="font-heading text-4xl text-white mb-2">PAY YOUR DEPOSIT</h1>
        <p className="text-text-muted">A 20% deposit confirms your booking. The remaining balance is due on move day.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="font-heading text-xl text-white mb-5">BOOKING SUMMARY</h2>
          {quote ? (
            <div className="space-y-3 text-sm">
              {([
                ['Name', quote.name],
                ['Service', quote.serviceType],
                ['Move Size', quote.moveSize],
                ['Move Date', quote.moveDate],
                ['From', quote.originCity],
                ['To', quote.destinationCity],
                ['Packing', quote.needsPacking ? 'Yes' : 'No'],
                ['Storage', quote.needsStorage ? 'Yes' : 'No'],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-text-muted">{label}</span>
                  <span className="text-white capitalize">{value}</span>
                </div>
              ))}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Estimated Total</span>
                  <span className="text-white">{quote.estimatedPrice ? formatCurrency(quote.estimatedPrice) : 'TBD'}</span>
                </div>
                <div className="flex justify-between font-heading text-xl">
                  <span className="text-white">Deposit (20%)</span>
                  <span className="text-primary">{formatCurrency(depositAmount)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-text-muted">No quote linked. You can still proceed with a deposit.</p>
              <div className="flex justify-between font-heading text-xl pt-4 border-t border-border">
                <span className="text-white">Deposit</span>
                <span className="text-primary">{formatCurrency(depositAmount)}</span>
              </div>
            </div>
          )}
          <div className="mt-6 bg-bg border border-border rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-primary shrink-0 mt-0.5" />
              <div className="text-xs text-text-muted leading-relaxed">
                <p className="text-white font-body mb-1">100% Refundable</p>
                Deposits are fully refundable up to 72 hours before your move date. No questions asked.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock size={16} className="text-primary" />
            <h2 className="font-heading text-xl text-white">SECURE PAYMENT</h2>
            <span className="ml-auto text-xs text-text-muted font-mono bg-bg border border-border px-2 py-0.5 rounded">DEMO MODE</span>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-3 mb-5 text-xs text-text-muted">
            Demo mode active — no real payment will be charged. Click Pay to simulate a successful payment.
          </div>
          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="label-dark">Cardholder Name</label>
              <input className="input-dark" placeholder="Jane Smith" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
            </div>
            <div>
              <label className="label-dark">Card Number</label>
              <input className="input-dark" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-dark">Expiry</label>
                <input className="input-dark" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} maxLength={5} />
              </div>
              <div>
                <label className="label-dark">CVC</label>
                <input className="input-dark" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} maxLength={3} />
              </div>
            </div>
            <button type="submit" disabled={paying} className="btn-primary w-full py-4 text-lg mt-2">
              {paying ? 'Processing...' : `Pay Deposit — ${formatCurrency(depositAmount)}`}
            </button>
          </form>
          <div className="flex items-center gap-2 mt-4 justify-center">
            <Lock size={12} className="text-text-muted" />
            <p className="text-xs text-text-muted">256-bit SSL encryption. Powered by Stripe.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-24 pb-16">
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <BookingContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
