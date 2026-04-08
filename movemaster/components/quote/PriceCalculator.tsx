'use client';

import { useState } from 'react';
import type { ServiceType, MoveSize } from '@/types';
import { useQuoteCalculator } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import { cities } from '@/data';

export default function PriceCalculator() {
  const [moveSize, setMoveSize] = useState<MoveSize | ''>('');
  const [serviceType, setServiceType] = useState<ServiceType | ''>('');
  const [originCity, setOriginCity] = useState('');
  const [destinationCity, setDestinationCity] = useState('');
  const [needsPacking, setNeedsPacking] = useState(false);
  const [needsStorage, setNeedsStorage] = useState(false);
  const [hasSpecialtyItems, setHasSpecialtyItems] = useState(false);
  const [hasElevator, setHasElevator] = useState(true);
  const [floorOrigin, setFloorOrigin] = useState(1);

  const estimate = useQuoteCalculator({
    moveSize: moveSize || undefined,
    serviceType: serviceType || undefined,
    originCity,
    destinationCity,
    needsPacking,
    needsStorage,
    hasSpecialtyItems,
    hasElevator,
    floorOrigin,
    floorDestination: 1,
  });

  const cityNames = cities.map((c) => c.name);

  return (
    <div className="bg-bg border border-border rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="label-dark">Home / Office Size *</label>
          <select className="input-dark" value={moveSize} onChange={(e) => setMoveSize(e.target.value as MoveSize)}>
            <option value="">Select size...</option>
            {[
              { value: 'studio', label: 'Studio' },
              { value: '1-bedroom', label: '1 Bedroom' },
              { value: '2-bedroom', label: '2 Bedroom' },
              { value: '3-bedroom', label: '3 Bedroom' },
              { value: '4-bedroom', label: '4+ Bedroom' },
              { value: 'office-small', label: 'Small Office' },
              { value: 'office-large', label: 'Large Office' },
            ].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label-dark">Service Type *</label>
          <select className="input-dark" value={serviceType} onChange={(e) => setServiceType(e.target.value as ServiceType)}>
            <option value="">Select service...</option>
            {[
              { value: 'residential', label: 'Residential Moving' },
              { value: 'commercial', label: 'Commercial Moving' },
              { value: 'long-distance', label: 'Long-Distance' },
              { value: 'packing', label: 'Packing Only' },
              { value: 'storage', label: 'Storage' },
              { value: 'specialty', label: 'Specialty Items' },
              { value: 'last-minute', label: 'Last-Minute Move' },
              { value: 'senior', label: 'Senior Moving' },
            ].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label-dark">Origin City</label>
          <select className="input-dark" value={originCity} onChange={(e) => setOriginCity(e.target.value)}>
            <option value="">Select city...</option>
            {cityNames.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label-dark">Destination City</label>
          <select className="input-dark" value={destinationCity} onChange={(e) => setDestinationCity(e.target.value)}>
            <option value="">Select city...</option>
            {cityNames.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { key: 'needsPacking', label: 'Packing Service', value: needsPacking, set: setNeedsPacking },
          { key: 'needsStorage', label: 'Storage', value: needsStorage, set: setNeedsStorage },
          { key: 'hasSpecialtyItems', label: 'Specialty Items', value: hasSpecialtyItems, set: setHasSpecialtyItems },
          { key: 'hasElevator', label: 'Elevator Available', value: hasElevator, set: setHasElevator },
        ].map(({ key, label, value, set }) => (
          <button
            key={key}
            type="button"
            onClick={() => set(!value)}
            className={`p-3 rounded-xl border-2 text-sm transition-all text-left ${value ? 'border-primary bg-primary/10 text-white' : 'border-border bg-surface text-text-muted hover:border-primary/40'}`}
          >
            <span className={`w-4 h-4 rounded border inline-flex items-center justify-center mr-2 ${value ? 'bg-primary border-primary' : 'border-border'}`}>
              {value && <span className="text-white text-xs">✓</span>}
            </span>
            {label}
          </button>
        ))}
      </div>

      {estimate ? (
        <div className="bg-primary/10 border border-primary/40 rounded-xl p-6">
          <p className="text-primary font-mono text-xs tracking-widest uppercase mb-4">Your Estimate</p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Est. hours</span>
              <span className="text-white">{estimate.estimatedHours} hrs</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Hourly rate</span>
              <span className="text-white">{formatCurrency(estimate.hourlyRate)}/hr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Base price</span>
              <span className="text-white">{formatCurrency(estimate.basePrice)}</span>
            </div>
            {estimate.packingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Packing</span>
                <span className="text-white">+{formatCurrency(estimate.packingFee)}</span>
              </div>
            )}
            {estimate.storageFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Storage</span>
                <span className="text-white">+{formatCurrency(estimate.storageFee)}/mo</span>
              </div>
            )}
            {estimate.specialtyFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Specialty items</span>
                <span className="text-white">+{formatCurrency(estimate.specialtyFee)}</span>
              </div>
            )}
            {estimate.longDistanceFee > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Long-distance fee</span>
                <span className="text-white">+{formatCurrency(estimate.longDistanceFee)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-primary/30 pt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-text-muted">Estimated Range</span>
              <span className="font-heading text-2xl text-primary">
                {formatCurrency(estimate.totalMin)} – {formatCurrency(estimate.totalMax)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Deposit to book (20%)</span>
              <span className="text-white">{formatCurrency(estimate.depositAmount)}</span>
            </div>
          </div>
          <p className="text-text-muted text-xs mt-3">Estimate is ±15%. Final price confirmed after coordinator review.</p>
          <a href="/quote" className="btn-primary w-full text-center mt-4 block">Get Official Quote →</a>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 text-center text-text-muted text-sm">
          Select your home size and service type to see an instant estimate.
        </div>
      )}
    </div>
  );
}
