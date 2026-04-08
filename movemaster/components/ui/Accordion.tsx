'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FAQItem } from '@/types';

export default function Accordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpen(open === item.id ? null : item.id)}
            className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 bg-surface hover:bg-white/5 transition-colors"
          >
            <span className="font-body font-medium text-text-primary">{item.question}</span>
            <ChevronDown size={18} className={cn('text-primary shrink-0 transition-transform', open === item.id && 'rotate-180')} />
          </button>
          {open === item.id && (
            <div className="px-6 py-4 bg-surface/50 text-text-muted text-sm leading-relaxed border-t border-border">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
