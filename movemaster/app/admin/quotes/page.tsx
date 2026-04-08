'use client';

import { useEffect, useState } from 'react';
import { getAllQuotes, updateQuoteStatus } from '@/firebase/firestore';
import type { QuoteRequest, BookingStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const toast = useToast();

  useEffect(() => {
    getAllQuotes().then((q) => { setQuotes(q); setLoading(false); });
  }, []);

  async function handleStatusChange(id: string, status: BookingStatus) {
    await updateQuoteStatus(id, status);
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status } : q));
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null);
    toast.success(`Quote ${id} updated to ${status}`);
  }

  const filtered = quotes.filter((q) => {
    if (statusFilter && q.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return q.name.toLowerCase().includes(s) || q.id.toLowerCase().includes(s) || q.originCity.toLowerCase().includes(s) || q.destinationCity.toLowerCase().includes(s);
    }
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin" className="text-text-muted hover:text-primary transition-colors"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-heading text-3xl text-white">QUOTE MANAGEMENT</h1>
              <p className="text-text-muted text-sm">{quotes.length} total quote requests</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="input-dark pl-9"
                placeholder="Search by name, ID, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input-dark w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')}
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>)}
            </select>
            <div className="text-text-muted text-sm self-center">{filtered.length} results</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table */}
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
              ) : filtered.length === 0 ? (
                <div className="bg-surface border border-border rounded-xl p-12 text-center text-text-muted">
                  No quotes found. Submit one via the <Link href="/quote" className="text-primary">quote form</Link>.
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setSelected(q)}
                      className={`w-full text-left bg-surface border rounded-xl p-4 transition-colors ${selected?.id === q.id ? 'border-primary' : 'border-border hover:border-primary/40'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-primary font-mono text-xs">{q.id}</span>
                            <StatusBadge status={q.status} />
                            {q.depositPaid && <span className="text-green-400 text-xs font-mono bg-green-900/30 border border-green-800 px-2 py-0.5 rounded-full">Deposit Paid</span>}
                          </div>
                          <p className="text-white text-sm font-body">{q.name}</p>
                          <p className="text-text-muted text-xs truncate">{q.originCity} → {q.destinationCity} · {q.moveDate || 'Date TBD'} · {q.serviceType}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {q.estimatedPrice && <p className="text-primary font-heading">{formatCurrency(q.estimatedPrice)}</p>}
                          <p className="text-text-muted text-xs">{new Date(q.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              {selected ? (
                <div className="bg-surface border border-border rounded-xl p-5 sticky top-24">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-primary font-mono text-xs">{selected.id}</p>
                      <h3 className="font-heading text-xl text-white">{selected.name}</h3>
                    </div>
                    <StatusBadge status={selected.status} />
                  </div>

                  <div className="space-y-2 mb-5 text-sm">
                    {[
                      ['Email', selected.email],
                      ['Phone', selected.phone],
                      ['From', `${selected.originAddress ? selected.originAddress + ', ' : ''}${selected.originCity}`],
                      ['To', `${selected.destinationAddress ? selected.destinationAddress + ', ' : ''}${selected.destinationCity}`],
                      ['Move Date', selected.moveDate || '—'],
                      ['Size', selected.moveSize],
                      ['Service', selected.serviceType],
                      ['Packing', selected.needsPacking ? 'Yes' : 'No'],
                      ['Storage', selected.needsStorage ? 'Yes' : 'No'],
                      ['Specialty Items', selected.hasSpecialtyItems ? 'Yes' : 'No'],
                      ['Elevator', selected.hasElevator ? 'Yes' : 'No'],
                      ['Estimated Price', selected.estimatedPrice ? formatCurrency(selected.estimatedPrice) : '—'],
                      ['Deposit Amount', selected.depositAmount ? formatCurrency(selected.depositAmount) : '—'],
                      ['Deposit Paid', selected.depositPaid ? 'Yes' : 'No'],
                      ['Submitted', new Date(selected.createdAt).toLocaleString()],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-2">
                        <span className="text-text-muted shrink-0">{label}</span>
                        <span className="text-white text-right capitalize truncate">{value}</span>
                      </div>
                    ))}
                    {selected.notes && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-text-muted text-xs mb-1">Notes</p>
                        <p className="text-text-muted text-sm italic">{selected.notes}</p>
                      </div>
                    )}
                    {selected.specialtyDetails && (
                      <div>
                        <p className="text-text-muted text-xs mb-1">Specialty Details</p>
                        <p className="text-text-muted text-sm italic">{selected.specialtyDetails}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="label-dark text-xs">Update Status</label>
                    <select
                      className="input-dark"
                      value={selected.status}
                      onChange={(e) => handleStatusChange(selected.id, e.target.value as BookingStatus)}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <a href={`mailto:${selected.email}`} className="flex-1 text-center text-sm border border-border text-text-muted hover:border-primary hover:text-primary py-2 rounded transition-colors">
                      Email Client
                    </a>
                    <a href={`tel:${selected.phone}`} className="flex-1 text-center text-sm border border-border text-text-muted hover:border-primary hover:text-primary py-2 rounded transition-colors">
                      Call Client
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-muted sticky top-24">
                  <p className="text-sm">Select a quote to view full details and update its status.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
