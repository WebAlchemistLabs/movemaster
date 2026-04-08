'use client';

import { useQuote } from '@/context/QuoteContext';
import type { MoveSize, ServiceType } from '@/types';
import { cn } from '@/lib/utils';

const moveSizes: { value: MoveSize; label: string; rooms: string; icon: string }[] = [
  { value: 'studio', label: 'Studio', rooms: '1 room', icon: '🛏' },
  { value: '1-bedroom', label: '1 Bedroom', rooms: '2–3 rooms', icon: '🛏' },
  { value: '2-bedroom', label: '2 Bedroom', rooms: '4–5 rooms', icon: '🏠' },
  { value: '3-bedroom', label: '3 Bedroom', rooms: '6–7 rooms', icon: '🏡' },
  { value: '4-bedroom', label: '4+ Bedroom', rooms: '8+ rooms', icon: '🏘' },
  { value: 'office-small', label: 'Small Office', rooms: 'Up to 20 desks', icon: '🏢' },
  { value: 'office-large', label: 'Large Office', rooms: '20+ desks', icon: '🏙' },
];

const serviceTypes: { value: ServiceType; label: string; desc: string }[] = [
  { value: 'residential', label: 'Residential', desc: 'Home or apartment move' },
  { value: 'commercial', label: 'Commercial', desc: 'Office or business' },
  { value: 'long-distance', label: 'Long-Distance', desc: 'Over 50km away' },
  { value: 'packing', label: 'Packing Only', desc: 'Pack without moving' },
  { value: 'storage', label: 'Storage', desc: 'Secure short/long term' },
  { value: 'specialty', label: 'Specialty Items', desc: 'Piano, antiques, etc.' },
  { value: 'last-minute', label: 'Last-Minute', desc: 'Need to move ASAP' },
  { value: 'senior', label: 'Senior Move', desc: 'Extra care & patience' },
];

export default function Step1MoveDetails() {
  const { formData, updateForm, setStep } = useQuote();

  const valid = formData.moveSize && formData.serviceType && formData.moveDate;

  return (
    <div className="animate-fade-in">
      <h2 className="font-heading text-white text-2xl mb-1 tracking-wide">Move Details</h2>
      <p className="text-text-muted text-sm mb-6">Tell us about the size and type of your move.</p>

      {/* Move Size */}
      <div className="mb-6">
        <label className="block text-white text-sm font-body mb-3">Home or Office Size</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {moveSizes.map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => updateForm({ moveSize: size.value })}
              className={cn(
                'p-3 rounded-xl border-2 text-left transition-all',
                formData.moveSize === size.value
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-border bg-bg text-text-muted hover:border-primary/50'
              )}
            >
              <span className="text-xl">{size.icon}</span>
              <p className="font-heading tracking-wide text-sm mt-1">{size.label}</p>
              <p className="text-xs opacity-70">{size.rooms}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Service Type */}
      <div className="mb-6">
        <label className="block text-white text-sm font-body mb-3">Type of Service</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {serviceTypes.map((svc) => (
            <button
              key={svc.value}
              type="button"
              onClick={() => updateForm({ serviceType: svc.value })}
              className={cn(
                'p-3 rounded-xl border-2 text-left transition-all',
                formData.serviceType === svc.value
                  ? 'border-primary bg-primary/10 text-white'
                  : 'border-border bg-bg text-text-muted hover:border-primary/50'
              )}
            >
              <p className="font-heading tracking-wide text-sm">{svc.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{svc.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Move Date */}
      <div className="mb-6">
        <label className="block text-white text-sm font-body mb-2">Preferred Move Date</label>
        <input
          type="date"
          className="input-dark"
          value={formData.moveDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => updateForm({ moveDate: e.target.value })}
        />
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.flexibleDates}
            onChange={(e) => updateForm({ flexibleDates: e.target.checked })}
            className="accent-primary w-4 h-4"
          />
          <span className="text-text-muted text-sm">My dates are flexible (may qualify for a discount)</span>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setStep(2)}
          disabled={!valid}
          className="btn-primary"
        >
          Next: Locations →
        </button>
      </div>
    </div>
  );
}
