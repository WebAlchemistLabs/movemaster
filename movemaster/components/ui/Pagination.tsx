import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps { page: number; total: number; perPage: number; onChange: (p: number) => void; }

export default function Pagination({ page, total, perPage, onChange }: PaginationProps) {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => onChange(page - 1)} disabled={page === 1} className="p-2 rounded border border-border text-text-muted hover:border-primary hover:text-primary disabled:opacity-30 transition-colors">
        <ChevronLeft size={16} />
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} onClick={() => onChange(p)} className={cn('w-9 h-9 rounded border text-sm font-mono-custom transition-colors', p === page ? 'border-primary bg-primary text-white' : 'border-border text-text-muted hover:border-primary hover:text-primary')}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(page + 1)} disabled={page === pages} className="p-2 rounded border border-border text-text-muted hover:border-primary hover:text-primary disabled:opacity-30 transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
