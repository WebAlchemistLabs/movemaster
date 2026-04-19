import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RatingStars({ rating, size = 16, className }: { rating: number; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1,2,3,4,5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}
        />
      ))}
    </div>
  );
}
