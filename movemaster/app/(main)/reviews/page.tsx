'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReviewCard from '@/components/reviews/ReviewCard';
import RatingStars from '@/components/ui/RatingStars';
import Pagination from '@/components/ui/Pagination';
import { reviews } from '@/data';
import type { ServiceType } from '@/types';

const PER_PAGE = 12;

export default function ReviewsPage() {
  const [serviceFilter, setServiceFilter] = useState<ServiceType | ''>('');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [page, setPage] = useState(1);

  const filtered = reviews.filter((r) => {
    if (serviceFilter && r.serviceType !== serviceFilter) return false;
    if (ratingFilter && r.rating < ratingFilter) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  const dist = [5,4,3,2,1].map((s) => ({ star: s, count: reviews.filter((r) => Math.round(r.rating) === s).length }));

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Summary */}
        <div className="bg-surface border-b border-border py-12">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-2">Verified Reviews</p>
                <h1 className="font-heading text-5xl text-text-primary mb-4">WHAT CLIENTS SAY</h1>
                <div className="flex items-center gap-4 mb-2">
                  <span className="font-heading text-5xl text-text-primary">{avg.toFixed(1)}</span>
                  <div>
                    <RatingStars rating={avg} size={20} />
                    <p className="text-text-muted text-sm mt-1">Based on {reviews.length} verified reviews</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {dist.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-text-muted text-sm w-4">{star}</span>
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(count / reviews.length) * 100}%` }} />
                    </div>
                    <span className="text-text-muted text-xs w-6">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-bg border-b border-border py-4">
          <div className="container-custom flex flex-wrap gap-3 items-center">
            <select value={serviceFilter} onChange={(e) => { setServiceFilter(e.target.value as ServiceType | ''); setPage(1); }} className="bg-surface border border-border text-text-muted text-sm px-3 py-2 rounded">
              <option value="">All Services</option>
              {['residential','commercial','long-distance','packing','storage','specialty','last-minute','senior'].map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <select value={ratingFilter} onChange={(e) => { setRatingFilter(Number(e.target.value)); setPage(1); }} className="bg-surface border border-border text-text-muted text-sm px-3 py-2 rounded">
              <option value={0}>All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={3}>3+ Stars</option>
            </select>
            <span className="text-text-muted text-sm ml-auto">{filtered.length} reviews</span>
          </div>
        </div>

        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {paginated.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
            <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
