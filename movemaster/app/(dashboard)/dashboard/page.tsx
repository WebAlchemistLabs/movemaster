'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText, Calendar, Clock, TrendingUp, DollarSign,
  Phone, ArrowRight, Plus, Users, AlertCircle, CheckCircle, Truck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { bookkeepingApi, quotesApi, isApiEnabled, type DashboardStats, type QuoteRecord } from '@/lib/api';
import { getUserQuotes, getAllQuotes } from '@/firebase/firestore';
import type { QuoteRequest } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const { user, userRole } = useAuth();
  const isAdmin = userRole === 'admin';

  const [stats, setStats]   = useState<DashboardStats | null>(null);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      if (isAdmin && isApiEnabled) {
        // ── Admin: pull full bookkeeping dashboard ──
        const data = await bookkeepingApi.getDashboard();
        setStats(data);
        setQuotes((data.recentJobs ?? []) as unknown as QuoteRequest[]);
      } else if (!isAdmin && isApiEnabled) {
        // ── Customer: pull their own quotes ──
        const data = await quotesApi.getMine();
        setQuotes(data as unknown as QuoteRequest[]);
      } else {
        // ── Fallback localStorage mode ──
        const data = isAdmin ? await getAllQuotes() : await getUserQuotes(user.uid);
        setQuotes(data);
      }
    } catch (e: unknown) {
      setError((e as Error).message);
      console.error('Dashboard load error:', e);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => { load(); }, [load]);

  // ── Admin view ────────────────────────────────────────────────────────────
  if (isAdmin) {
    const s = stats;
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-primary font-mono text-xs tracking-widest uppercase mb-1">Business Overview</p>
            <h1 className="font-heading text-4xl text-white">WELCOME, <span className="text-primary">ADMIN</span></h1>
            <p className="text-text-muted mt-1">Signed in as {user?.email}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/admin/quotes" className="bg-primary hover:bg-primary-hover text-white font-heading text-sm tracking-wider uppercase px-5 py-2.5 rounded-sm transition-colors">
              Manage Quotes
            </Link>
            <Link href="/admin" className="border border-primary text-primary hover:bg-primary hover:text-white font-heading text-sm tracking-wider uppercase px-5 py-2.5 rounded-sm transition-colors">
              Admin Panel
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-xl p-4 mb-6 text-red-300 text-sm">
            ⚠ Could not load data: {error} — Make sure the backend server is running at port 4000.
          </div>
        )}

        {/* Top 4 stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label:'Total Quotes',        value: s?.jobs.total ?? 0,                             icon:<FileText size={20}/>,  color:'text-blue-400' },
            { label:'Deposits Collected',  value: formatCurrency(s?.revenue.totalCollected ?? 0), icon:<DollarSign size={20}/>, color:'text-green-400' },
            { label:'Est. Pipeline',       value: formatCurrency(s?.revenue.pipeline ?? 0),       icon:<TrendingUp size={20}/>, color:'text-primary' },
            { label:'Active Customers',    value: s?.clients ?? 0,                                icon:<Users size={20}/>,     color:'text-purple-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-xl p-5">
              <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
              <p className="font-heading text-2xl text-white">{stat.value}</p>
              <p className="text-text-muted text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Status boxes */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          {[
            { label:'Pending',     value: s?.jobs.pending    ?? 0, cls:'border-yellow-500/40 bg-yellow-500/5', text:'text-yellow-400', icon:<AlertCircle  size={14}/> },
            { label:'Confirmed',   value: s?.jobs.confirmed  ?? 0, cls:'border-blue-500/40 bg-blue-500/5',     text:'text-blue-400',   icon:<CheckCircle  size={14}/> },
            { label:'In Progress', value: s?.jobs.inProgress ?? 0, cls:'border-primary/40 bg-primary/5',       text:'text-primary',    icon:<Truck        size={14}/> },
            { label:'Completed',   value: s?.jobs.completed  ?? 0, cls:'border-green-500/40 bg-green-500/5',   text:'text-green-400',  icon:<CheckCircle  size={14}/> },
            { label:'This Month',  value: s?.jobs.thisMonth  ?? 0, cls:'border-purple-500/40 bg-purple-500/5', text:'text-purple-400', icon:<Calendar     size={14}/> },
          ].map((box) => (
            <div key={box.label} className={`border rounded-xl p-4 ${box.cls}`}>
              <div className={`flex items-center gap-1.5 mb-2 ${box.text}`}>
                {box.icon}
                <span className="text-xs font-mono uppercase tracking-wider">{box.label}</span>
              </div>
              <p className="font-heading text-3xl text-white">{box.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Active & upcoming moves */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-2xl text-white">ACTIVE & UPCOMING MOVES</h2>
              <Link href="/admin/quotes" className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">
                Manage <ArrowRight size={14}/>
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div>
            ) : (s?.upcoming ?? []).length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-muted text-sm">No active moves right now.</div>
            ) : (
              <div className="space-y-3">
                {(s?.upcoming ?? []).map((move) => (
                  <div key={move.id} className="bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-white font-heading text-base">{move.originCity} → {move.destinationCity}</p>
                          <StatusBadge status={move.status as 'pending'|'confirmed'|'in-progress'|'completed'|'cancelled'} />
                        </div>
                        <p className="text-text-muted text-xs">{move.moveDate} · {move.moveSize} · {move.serviceType}</p>
                        <p className="text-primary text-xs mt-1 font-mono">
                          Client: {move.name} ·{' '}
                          <a href={`tel:${move.phone}`} className="hover:underline">{move.phone}</a>
                        </p>
                        {move.assignedCrew && <p className="text-text-muted text-xs mt-0.5">Crew: {move.assignedCrew}</p>}
                      </div>
                      <a href={`tel:${move.phone}`} className="text-xs border border-border text-text-muted hover:border-primary hover:text-primary px-3 py-1.5 rounded transition-colors flex items-center gap-1">
                        <Phone size={12}/> Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Service breakdown */}
          <div>
            <h2 className="font-heading text-2xl text-white mb-4">SERVICE BREAKDOWN</h2>
            <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
              {loading ? (
                <div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div>
              ) : (s?.serviceBreakdown ?? []).length === 0 ? (
                <p className="text-text-muted text-sm text-center py-2">No data yet</p>
              ) : (
                (s?.serviceBreakdown ?? []).map((svc) => (
                  <div key={svc.type}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-text-muted text-xs capitalize">{svc.type.replace('-',' ')}</span>
                      <span className="text-white text-xs font-mono">{svc.count} jobs</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width:`${Math.min(100,(svc.count/(s?.jobs.total||1))*100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent quotes table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-2xl text-white">RECENT QUOTE REQUESTS</h2>
            <Link href="/admin/quotes" className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14}/>
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div>
          ) : quotes.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-10 text-center text-text-muted">
              No quotes yet — run <code className="text-primary">npm run db:seed</code> in the backend terminal.
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-bg">
                    <tr>
                      {['Client','Route','Move Date','Service','Estimate','Status','Deposit'].map(h=>(
                        <th key={h} className="text-left px-4 py-3 text-text-muted text-xs font-mono uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {quotes.slice(0,15).map(q=>(
                      <tr key={q.id} className="hover:bg-white/3 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-white text-sm whitespace-nowrap">{q.name}</p>
                          <p className="text-text-muted text-xs">{q.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-text-muted whitespace-nowrap">{q.originCity} → {q.destinationCity}</td>
                        <td className="px-4 py-3 text-text-muted whitespace-nowrap">{q.moveDate || '—'}</td>
                        <td className="px-4 py-3 text-text-muted capitalize whitespace-nowrap">{q.serviceType}</td>
                        <td className="px-4 py-3 text-primary font-heading whitespace-nowrap">
                          {q.estimatedPrice ? formatCurrency(q.estimatedPrice) : '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <StatusBadge status={q.status as 'pending'|'confirmed'|'in-progress'|'completed'|'cancelled'} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {q.depositPaid
                            ? <span className="text-green-400 text-xs font-mono">✓ Paid</span>
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
    );
  }

  // ── Customer view ─────────────────────────────────────────────────────────
  const upcoming = quotes.filter(q=>q.status==='confirmed'||q.status==='in-progress');
  const recent   = quotes.slice(0,5);

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl text-white">
          WELCOME BACK, <span className="text-primary">{user?.displayName?.split(' ')[0].toUpperCase()}</span>
        </h1>
        <p className="text-text-muted mt-1">Here is an overview of your moves and quotes.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label:'Total Quotes', value:quotes.length,                                          icon:<FileText size={20}/> },
          { label:'Confirmed',    value:quotes.filter(q=>q.status==='confirmed').length,         icon:<Calendar size={20}/> },
          { label:'Completed',    value:quotes.filter(q=>q.status==='completed').length,         icon:<Clock    size={20}/> },
          { label:'Pending',      value:quotes.filter(q=>q.status==='pending').length,           icon:<TrendingUp size={20}/> },
        ].map(stat=>(
          <div key={stat.label} className="bg-surface border border-border rounded-xl p-4">
            <div className="text-primary mb-2">{stat.icon}</div>
            <p className="font-heading text-2xl text-white">{stat.value}</p>
            <p className="text-text-muted text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

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
          </div>
        </div>
      )}

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-2xl text-white">RECENT QUOTES</h2>
          <Link href="/dashboard/quotes" className="text-primary text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View All <ArrowRight size={14}/>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"/></div>
        ) : recent.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-10 text-center">
            <FileText size={32} className="text-text-muted mx-auto mb-3"/>
            <p className="text-text-muted mb-4">No quotes yet. Get your first one in 5 minutes.</p>
            <Link href="/quote" className="btn-primary">Get a Free Quote</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map(q=>(
              <div key={q.id} className="bg-surface border border-border rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white text-sm font-body">{q.originCity} → {q.destinationCity}</p>
                    <StatusBadge status={q.status}/>
                  </div>
                  <p className="text-text-muted text-xs">{q.moveDate} · {q.moveSize} · ID: {q.id}</p>
                </div>
                <div className="text-right">
                  {q.estimatedPrice && <p className="text-primary font-heading text-lg">{formatCurrency(q.estimatedPrice)}</p>}
                  {q.status==='confirmed'&&!q.depositPaid&&(
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

      <div>
        <h2 className="font-heading text-2xl text-white mb-4">QUICK ACTIONS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/quote" className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors flex items-center gap-3">
            <Plus size={20} className="text-primary"/>
            <div><p className="text-white text-sm font-body">New Quote</p><p className="text-text-muted text-xs">5-minute process</p></div>
          </Link>
          <Link href="/contact" className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors flex items-center gap-3">
            <Phone size={20} className="text-primary"/>
            <div><p className="text-white text-sm font-body">Contact Us</p><p className="text-text-muted text-xs">Questions or changes</p></div>
          </Link>
          <Link href="/reviews" className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors flex items-center gap-3">
            <FileText size={20} className="text-primary"/>
            <div><p className="text-white text-sm font-body">View Reviews</p><p className="text-text-muted text-xs">What clients say</p></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
