'use client';
import { useToastStore } from '@/hooks';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  success: <CheckCircle size={18} className="text-green-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-blue-400" />,
  warning: <AlertTriangle size={18} className="text-yellow-400" />,
};

export default function ToastContainer() {
  const { toasts, remove } = useToastStore();
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto animate-slide-in-right flex items-start gap-3 bg-surface border border-border rounded-lg px-4 py-3 shadow-xl max-w-sm">
          {icons[t.type]}
          <p className="text-sm text-text-primary flex-1">{t.message}</p>
          <button onClick={() => remove(t.id)} className="text-text-muted hover:text-text-primary ml-2">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
