import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProgressProps {
  steps: string[];
  current: number;
}

export default function StepProgress({ steps, current }: StepProgressProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading transition-colors',
                done ? 'bg-primary text-white' : active ? 'bg-primary text-white ring-4 ring-primary/30' : 'bg-surface border border-border text-text-muted'
              )}>
                {done ? <Check size={14} /> : num}
              </div>
              <span className={cn('text-xs mt-1 hidden sm:block whitespace-nowrap', active ? 'text-primary' : 'text-text-muted')}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-px mx-2 transition-colors', done ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
