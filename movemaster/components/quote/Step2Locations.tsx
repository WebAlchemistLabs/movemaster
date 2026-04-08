'use client';

import { useQuote } from '@/context/QuoteContext';
import { cities } from '@/data';

const cityOptions = [...cities.map((c) => c.name), 'Other'];

export default function Step2Locations() {
  const { formData, updateForm, setStep } = useQuote();
  const valid = formData.originCity && formData.destinationCity;

  return (
    <div className="animate-fade-in">
      <h2 className="font-heading text-white text-2xl mb-1 tracking-wide">Locations</h2>
      <p className="text-text-muted text-sm mb-6">Where are you moving from and to?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Origin */}
        <div className="space-y-3">
          <h3 className="font-heading text-primary text-sm tracking-widest">MOVING FROM</h3>
          <div>
            <label className="block text-text-muted text-xs mb-1">Street Address</label>
            <input className="input-dark" placeholder="123 Main Street" value={formData.originAddress} onChange={(e) => updateForm({ originAddress: e.target.value })} />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1">City *</label>
            <select className="input-dark" value={formData.originCity} onChange={(e) => updateForm({ originCity: e.target.value })}>
              <option value="">Select city...</option>
              {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-text-muted text-xs mb-1">Floor #</label>
              <input type="number" min={1} max={50} className="input-dark" value={formData.floorOrigin} onChange={(e) => updateForm({ floorOrigin: parseInt(e.target.value) || 1 })} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-primary w-4 h-4" checked={formData.hasElevator} onChange={(e) => updateForm({ hasElevator: e.target.checked })} />
                <span className="text-text-muted text-sm">Elevator available</span>
              </label>
            </div>
          </div>
        </div>

        {/* Destination */}
        <div className="space-y-3">
          <h3 className="font-heading text-primary text-sm tracking-widest">MOVING TO</h3>
          <div>
            <label className="block text-text-muted text-xs mb-1">Street Address</label>
            <input className="input-dark" placeholder="456 Oak Avenue" value={formData.destinationAddress} onChange={(e) => updateForm({ destinationAddress: e.target.value })} />
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1">City *</label>
            <select className="input-dark" value={formData.destinationCity} onChange={(e) => updateForm({ destinationCity: e.target.value })}>
              <option value="">Select city...</option>
              {cityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-text-muted text-xs mb-1">Floor #</label>
            <input type="number" min={1} max={50} className="input-dark" value={formData.floorDestination} onChange={(e) => updateForm({ floorDestination: parseInt(e.target.value) || 1 })} />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep(1)} className="btn-outline">← Back</button>
        <button type="button" onClick={() => setStep(3)} disabled={!valid} className="btn-primary">Next: Add-Ons →</button>
      </div>
    </div>
  );
}
