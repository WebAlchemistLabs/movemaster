import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({ eyebrow, title, subtitle, centered, light, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12', centered && 'text-center', className)}>
      {eyebrow && (
        <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-3">{eyebrow}</p>
      )}
      <h2 className={cn('font-heading text-4xl md:text-5xl', light ? 'text-gray-900' : 'text-text-primary')}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('mt-4 text-lg max-w-2xl', light ? 'text-gray-600' : 'text-text-muted', centered && 'mx-auto')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
