'use client';

import { useQuote } from '@/context/QuoteContext';
import { cn } from '@/lib/utils';

const toggles = [
  { key: 'needsPacking' as const, label: 'Packing Service', desc: 'Our crew packs everything for you. All materials included.', price: '+30% of base' },
  { key: 'needsStorage' as const, label: 'Storage Needed', desc: 'Store belongings before or after your move.', price: '+$149/month' },
  { key: 'hasSpecialtyItems' as const, label: 'Specialty Items', desc: 'Piano, antiques, artwork, gym equipment, safe, etc.', price: '+$150–$400' },
];

export default function Step3AddOns() {
  const { formData, updateForm, setStep } = useQuote();

  return (
    <div className="animate-fade-in">
      <h2 className="font-heading text-white text-2xl mb-1 tracking-wide">Add-On Services</h2>
      <p className="text-text-muted text-sm mb-6">Customize your move with additional services.</p>

      <div className="space-y-3 mb-6">
        {toggles.map(({ key, label, desc, price }) => (
          <button
            key={key}
            type="button"
            onClick={() => updateForm({ [key]: !formData[key] })}
            className={cn(
              'w-full text-left p-4 rounded-xl border-2 transition-all',
              formData[key] ? 'border-primary bg-primary/10' : 'border-border bg-bg hover:border-primary/50'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-5 h-5 rounded border-2 flex items-center justify-center transition-all', formData[key] ? 'bg-primary border-primary' : 'border-border')}>
                  {formData[key] && <span className="text-white text-xs">✓</span>}
                </div>
                <div>
                  <p className="text-white text-sm font-body font-medium">{label}</p>
                  <p className="text-text-muted text-xs">{desc}</p>
                </div>
              </div>
              <span className="text-primary text-xs font-mono shrink-0 ml-4">{price}</span>
            </div>
          </button>
        ))}
      </div>

      {formData.hasSpecialtyItems && (
        <div className="mb-6">
          <label className="block text-white text-sm mb-2">Describe your specialty items</label>
          <textarea
            className="input-dark h-20 resize-none"
            placeholder="E.g., 1 baby grand piano, 2 large antique wardrobes, wall-mounted safe..."
            value={formData.specialtyDetails}
            onChange={(e) => updateForm({ specialtyDetails: e.target.value })}
          />
        </div>
      )}

      <div className="mb-6">
        <label className="block text-white text-sm mb-2">Additional Notes (optional)</label>
        <textarea
          className="input-dark h-20 resize-none"
          placeholder="Anything else we should know? Parking situation, access restrictions, fragile items, tight staircases..."
          value={formData.notes}
          onChange={(e) => updateForm({ notes: e.target.value })}
        />
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep(2)} className="btn-outline">← Back</button>
        <button type="button" onClick={() => setStep(4)} className="btn-primary">Next: Your Info →</button>
      </div>
    </div>
  );
}
