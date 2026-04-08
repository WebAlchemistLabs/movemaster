'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Users, TrendingUp, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { getAllQuotes } from '@/firebase/firestore';
import type { QuoteRequest } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import Navbar from '@/components/Navbar';

export default function AdminPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllQuotes().then((q) => { setQuotes(q); setLoading(false); });
  }, []);

  const pending = quotes.filter((q) => q.status === 'pending').length;
  const confirmed = quotes.filter((q) => q.status === 'confirmed').length;
  const completed = quotes.filter((q) => q.status === 'completed').length;
  const revenue = quotes.filter((q) => q.depositPaid).reduce((s, q) => s + (q.depositAmount ?? 0), 0);
  const recentQuotes = quotes.slice(0, 8);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-1">Admin Panel</p>
              <h1 className="font-heading text-4xl text-white">OPERATIONS OVERVIEW</h1>
            </div>
            <Link href="/quote" className="btn-primary text-sm">+ New Quote</Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Pending Quotes', value: pending, icon: <Clock size={22} />, color: 'text-yellow-400' },
              { label: 'Confirmed Moves', value: confirmed, icon: <CheckCircle size={22} />, color: 'text-blue-400' },
              { label: 'Completed', value: completed, icon: <TrendingUp size={22} />, color: 'text-green-400' },
              { label: 'Deposits Collected', value: formatCurrency(revenue), icon: <FileText size={22} />, color: 'text-primary' },
            ].map((s) => (
              <div key={s.label} className="bg-surface border border-border rounded-xl p-5">
                <div className={`mb-2 ${s.color}`}>{s.icon}</div>
                <p className="font-heading text-2xl text-white">{s.value}</p>
                <p className="text-text-muted text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Admin Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[
              { href: '/admin/quotes', label: 'Manage Quotes', desc: 'View and update all quote requests', icon: <FileText size={20} /> },
              { href: '/admin/crew', label: 'Manage Crew', desc: 'View crew roster and assignments', icon: <Users size={20} /> },
              { href: '/admin/cities', label: 'Coverage Areas', desc: 'Manage service city coverage', icon: <TrendingUp size={20} /> },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors group flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center text-primary shrink-0">{link.icon}</div>
                <div className="flex-1">
                  <p className="text-white font-heading text-base group-hover:text-primary transition-colors">{link.label}</p>
                  <p className="text-text-muted text-xs">{link.desc}</p>
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>

          {/* Recent Quotes Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl text-white">RECENT QUOTES</h2>
              <Link href="/admin/quotes" className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : recentQuotes.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-10 text-center text-text-muted">
                No quotes yet. They will appear here as customers submit quote requests.
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-bg">
                      <tr>
                        {['ID', 'Client', 'Route', 'Move Date', 'Service', 'Estimate', 'Status', 'Deposit'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-text-muted text-xs font-mono uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-white/3 transition-colors">
                          <td className="px-4 py-3 text-primary font-mono text-xs whitespace-nowrap">{q.id}</td>
                          <td className="px-4 py-3 text-white whitespace-nowrap">{q.name}</td>
                          <td className="px-4 py-3 text-text-muted whitespace-nowrap">{q.originCity} → {q.destinationCity}</td>
                          <td className="px-4 py-3 text-text-muted whitespace-nowrap">{q.moveDate || '—'}</td>
                          <td className="px-4 py-3 text-text-muted capitalize whitespace-nowrap">{q.serviceType}</td>
                          <td className="px-4 py-3 text-white whitespace-nowrap">{q.estimatedPrice ? formatCurrency(q.estimatedPrice) : '—'}</td>
                          <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={q.status} /></td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {q.depositPaid
                              ? <span className="text-green-400 text-xs font-mono">Paid</span>
                              : <span className="text-text-muted text-xs">Pending</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
