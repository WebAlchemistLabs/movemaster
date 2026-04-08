'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckSquare, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserQuotes } from '@/firebase/firestore';
import type { QuoteRequest } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';

const movingDayChecklist = [
  'Confirm move date and time window with coordinator',
  'Ensure all boxes are sealed and labelled',
  'Disconnect appliances (washer, dryer, dishwasher)',
  'Defrost refrigerator 24 hours in advance',
  'Arrange parking for the moving truck',
  'Book freight elevator if applicable',
  'Pack an essentials bag for the first night',
  'Charge your phone and power banks',
  'Have payment method ready for remaining balance',
  'Do a final walkthrough of old home before leaving',
];

export default function DashboardBookingsPage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) getUserQuotes(user.uid).then((q) => { setQuotes(q); setLoading(false); });
    const stored = localStorage.getItem('mm_checklist');
    if (stored) setChecked(JSON.parse(stored));
  }, [user]);

  function toggleCheck(item: string) {
    setChecked((prev) => {
      const next = { ...prev, [item]: !prev[item] };
      localStorage.setItem('mm_checklist', JSON.stringify(next));
      return next;
    });
  }

  const active = quotes.filter((q) => ['confirmed', 'in-progress'].includes(q.status));
  const past = quotes.filter((q) => q.status === 'completed');

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-white">BOOKINGS</h1>
        <p className="text-text-muted text-sm mt-1">Your active and past moves.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <>
          {/* Active */}
          <div className="mb-10">
            <h2 className="font-heading text-2xl text-white mb-4">UPCOMING MOVES</h2>
            {active.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-8 text-center">
                <Calendar size={32} className="text-text-muted mx-auto mb-3" />
                <p className="text-text-muted mb-4">No upcoming moves. Ready to book?</p>
                <Link href="/quote" className="btn-primary">Get a Free Quote</Link>
              </div>
            ) : (
              active.map((q) => (
                <div key={q.id} className="bg-primary/10 border border-primary/40 rounded-xl p-6 mb-4">
                  <div className="flex flex-wrap gap-4 items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-heading text-xl text-white">{q.originCity} → {q.destinationCity}</p>
                        <StatusBadge status={q.status} />
                      </div>
                      <p className="text-text-muted text-sm">{q.moveDate} · {q.moveSize} · {q.serviceType}</p>
                    </div>
                    {q.estimatedPrice && <p className="text-primary font-heading text-2xl">{formatCurrency(q.estimatedPrice)}</p>}
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <a href="tel:+18006683627" className="flex items-center gap-2 text-primary text-sm border border-primary px-4 py-2 rounded hover:bg-primary hover:text-white transition-colors">
                      <Phone size={14} /> Call Coordinator
                    </a>
                    <Link href="/contact" className="text-text-muted text-sm border border-border px-4 py-2 rounded hover:border-primary hover:text-primary transition-colors">
                      Send Message
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checklist */}
          {active.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading text-2xl text-white mb-4">MOVING DAY CHECKLIST</h2>
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {movingDayChecklist.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleCheck(item)}
                      className="flex items-start gap-3 text-left p-2 rounded hover:bg-white/5 transition-colors"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${checked[item] ? 'bg-primary border-primary' : 'border-border'}`}>
                        {checked[item] && <CheckSquare size={12} className="text-white" />}
                      </div>
                      <span className={`text-sm leading-relaxed transition-colors ${checked[item] ? 'text-text-muted line-through' : 'text-text-muted'}`}>{item}</span>
                    </button>
                  ))}
                </div>
                <p className="text-text-muted text-xs mt-4">
                  {Object.values(checked).filter(Boolean).length} of {movingDayChecklist.length} items checked
                </p>
              </div>
            </div>
          )}

          {/* Past moves */}
          <div>
            <h2 className="font-heading text-2xl text-white mb-4">PAST MOVES</h2>
            {past.length === 0 ? (
              <p className="text-text-muted text-sm">No completed moves yet.</p>
            ) : (
              <div className="space-y-3">
                {past.map((q) => (
                  <div key={q.id} className="bg-surface border border-border rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                    <div>
                      <p className="text-white text-sm">{q.originCity} → {q.destinationCity}</p>
                      <p className="text-text-muted text-xs">{q.moveDate} · {q.moveSize}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {q.estimatedPrice && <p className="text-text-muted text-sm">{formatCurrency(q.estimatedPrice)}</p>}
                      <StatusBadge status={q.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
