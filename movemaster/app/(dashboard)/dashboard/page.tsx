'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Calendar, ArrowRight, Phone, Plus, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserQuotes } from '@/firebase/firestore';
import type { QuoteRequest } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getUserQuotes(user.uid).then((q) => { setQuotes(q); setLoading(false); });
    }
  }, [user]);

  const upcoming = quotes.filter((q) => q.status === 'confirmed' || q.status === 'in-progress');
  const recent = quotes.slice(0, 3);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl text-white">
          WELCOME BACK, <span className="text-primary">{user?.displayName?.split(' ')[0].toUpperCase()}</span>
        </h1>
        <p className="text-text-muted mt-1">Here is an overview of your moves and quotes.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Quotes', value: quotes.length, icon: <FileText size={20} /> },
          { label: 'Confirmed', value: quotes.filter((q) => q.status === 'confirmed').length, icon: <Calendar size={20} /> },
          { label: 'Completed', value: quotes.filter((q) => q.status === 'completed').length, icon: <Clock size={20} /> },
          { label: 'Pending', value: quotes.filter((q) => q.status === 'pending').length, icon: <Clock size={20} /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
            <div className="text-primary mb-2">{stat.icon}</div>
            <p className="font-heading text-2xl text-white">{stat.value}</p>
            <p className="text-text-muted text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upcoming move */}
      {upcoming.length > 0 && (
        <div className="mb-10">
          <h2 className="font-heading text-2xl text-white mb-4">UPCOMING MOVE</h2>
          <div className="bg-primary/10 border border-primary/40 rounded-xl p-6">
            <div className="flex flex-wrap gap-4 justify-between items-start">
              <div>
                <p className="text-primary font-mono text-xs tracking-wider mb-1">NEXT MOVE</p>
                <p className="text-white font-heading text-xl">{upcoming[0].originCity} → {upcoming[0].destinationCity}</p>
                <p className="text-text-muted text-sm mt-1">{upcoming[0].moveDate} · {upcoming[0].moveSize} · {upcoming[0].serviceType}</p>
              </div>
              <StatusBadge status={upcoming[0].status} />
            </div>
            <div className="mt-4 pt-4 border-t border-primary/30 flex gap-3">
              <Link href="/contact" className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">
                <Phone size={14} /> Contact Coordinator
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recent quotes */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-2xl text-white">RECENT QUOTES</h2>
          <Link href="/dashboard/quotes" className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <FileText size={32} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-muted mb-4">No quotes yet. Get your first one in 5 minutes.</p>
            <Link href="/quote" className="btn-primary">Get a Free Quote</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((q) => (
              <div key={q.id} className="bg-surface border border-border rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white text-sm font-body">{q.originCity} → {q.destinationCity}</p>
                    <StatusBadge status={q.status} />
                  </div>
                  <p className="text-text-muted text-xs">{q.moveDate} · {q.moveSize} · ID: {q.id}</p>
                </div>
                <div className="text-right">
                  {q.estimatedPrice && <p className="text-primary font-heading text-lg">{formatCurrency(q.estimatedPrice)}</p>}
                  {q.status === 'confirmed' && !q.depositPaid && (
                    <Link href={`/booking?quoteId=${q.id}`} className="text-xs text-primary border border-primary px-3 py-1 rounded hover:bg-primary hover:text-white transition-colors mt-1 inline-block">
                      Pay Deposit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-heading text-2xl text-white mb-4">QUICK ACTIONS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/quote" className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors flex items-center gap-3">
            <Plus size={20} className="text-primary" />
            <div>
              <p className="text-white text-sm font-body">New Quote</p>
              <p className="text-text-muted text-xs">5-minute process</p>
            </div>
          </Link>
          <Link href="/contact" className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors flex items-center gap-3">
            <Phone size={20} className="text-primary" />
            <div>
              <p className="text-white text-sm font-body">Contact Us</p>
              <p className="text-text-muted text-xs">Questions or changes</p>
            </div>
          </Link>
          <Link href="/reviews" className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors flex items-center gap-3">
            <FileText size={20} className="text-primary" />
            <div>
              <p className="text-white text-sm font-body">View Reviews</p>
              <p className="text-text-muted text-xs">What clients say</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
