import { CheckCircle, ThumbsUp } from 'lucide-react';
import RatingStars from '@/components/ui/RatingStars';
import type { Review } from '@/types';
import { cn } from '@/lib/utils';

const serviceLabels: Record<string, string> = {
  residential: 'Residential', commercial: 'Commercial', 'long-distance': 'Long-Distance',
  packing: 'Packing', storage: 'Storage', specialty: 'Specialty', 'last-minute': 'Last-Minute', senior: 'Senior',
};

export default function ReviewCard({ review, compact }: { review: Review; compact?: boolean }) {
  return (
    <div className={cn('bg-surface border border-border rounded-xl p-5 flex flex-col gap-3 card-hover', compact && 'p-4')}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-heading text-primary text-lg shrink-0">
            {review.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-body font-medium text-text-primary text-sm">{review.name}</p>
              {review.verified && <CheckCircle size={12} className="text-green-400" />}
            </div>
            <p className="text-xs text-text-muted">{new Date(review.date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} size={14} />
      </div>

      <div>
        <p className="font-body font-semibold text-text-primary text-sm mb-1">{review.title}</p>
        <p className={cn('text-text-muted text-sm leading-relaxed', compact && 'line-clamp-3')}>{review.text}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-mono-custom bg-white/5 px-2 py-0.5 rounded">
            {serviceLabels[review.serviceType]}
          </span>
          <span className="text-xs text-text-muted">{review.originCity} → {review.destinationCity}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <ThumbsUp size={11} /> {review.helpfulCount}
        </div>
      </div>
    </div>
  );
}
