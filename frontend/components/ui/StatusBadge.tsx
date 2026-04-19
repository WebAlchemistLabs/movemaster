import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/types';

const map: Record<BookingStatus, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  confirmed: { label: 'Confirmed', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'in-progress': { label: 'In Progress', cls: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  completed: { label: 'Completed', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  const { label, cls } = map[status];
  return (
    <span className={cn('px-2.5 py-1 text-xs font-mono-custom border rounded-full', cls)}>
      {label}
    </span>
  );
}
