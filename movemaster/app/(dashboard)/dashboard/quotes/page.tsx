'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserQuotes } from '@/firebase/firestore';
import type { QuoteRequest } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';

export default function DashboardQuotesPage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserQuotes(user.uid).then((q) => { setQuotes(q); setLoading(false); });
    }
  }, [user]);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl text-white">MY QUOTES</h1>
          <p className="text-text-muted text-sm mt-1">All your quote requests and their current status.</p>
        </div>
        <Link href="/quote" className="btn-primary text-sm">+ New Quote</Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : quotes.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-16 text-center">
          <FileText size={40} className="text-text-muted mx-auto mb-4" />
          <h2 className="font-heading text-2xl text-white mb-2">NO QUOTES YET</h2>
          <p className="text-text-muted mb-6">Get your first free quote in about 5 minutes.</p>
          <Link href="/quote" className="btn-primary">Get a Free Quote</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <div key={q.id} className="bg-surface border border-border rounded-xl p-5">
              <div className="flex flex-wrap gap-4 justify-between items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <p className="text-white font-heading text-lg">{q.originCity} → {q.destinationCity}</p>
                    <StatusBadge status={q.status} />
                    {q.depositPaid && (
                      <span className="bg-green-900/40 text-green-400 border border-green-800 text-xs px-2 py-0.5 rounded-full font-mono">
                        Deposit Paid
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-text-muted text-xs">
                    <span>Ref: <span className="text-white font-mono">{q.id}</span></span>
                    <span>Date: {q.moveDate || 'TBD'}</span>
                    <span>Size: {q.moveSize}</span>
                    <span>Service: {q.serviceType}</span>
                    <span>Submitted: {new Date(q.createdAt).toLocaleDateString()}</span>
                  </div>
                  {q.notes && <p className="text-text-muted text-xs mt-2 italic">&quot;{q.notes}&quot;</p>}
                </div>
                <div className="text-right shrink-0">
                  {q.estimatedPrice && (
                    <p className="text-primary font-heading text-xl">{formatCurrency(q.estimatedPrice)}</p>
                  )}
                  {q.depositAmount && (
                    <p className="text-text-muted text-xs">Deposit: {formatCurrency(q.depositAmount)}</p>
                  )}
                  {q.status === 'confirmed' && !q.depositPaid && (
                    <Link href={`/booking?quoteId=${q.id}`} className="mt-2 inline-block bg-primary hover:bg-primary-hover text-white font-heading text-xs tracking-wider uppercase px-4 py-2 rounded-sm transition-colors">
                      Pay Deposit →
                    </Link>
                  )}
                </div>
              </div>
              {/* Timeline progress */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-0">
                  {(['pending', 'confirmed', 'in-progress', 'completed'] as const).map((s, i) => {
                    const statuses = ['pending', 'confirmed', 'in-progress', 'completed'];
                    const currentIdx = statuses.indexOf(q.status);
                    const stepIdx = statuses.indexOf(s);
                    const done = stepIdx <= currentIdx && q.status !== 'cancelled';
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs shrink-0 ${done ? 'bg-primary border-primary text-white' : 'border-border text-text-muted'}`}>
                          {done ? '✓' : i + 1}
                        </div>
                        <p className={`text-xs ml-1 ${done ? 'text-primary' : 'text-text-muted'} hidden sm:block capitalize`}>{s.replace('-', ' ')}</p>
                        {i < 3 && <div className={`flex-1 h-px mx-2 ${stepIdx < currentIdx ? 'bg-primary' : 'bg-border'}`} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
