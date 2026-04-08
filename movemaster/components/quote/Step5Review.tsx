'use client';

import { useState } from 'react';
import { useQuote } from '@/context/QuoteContext';
import { useQuoteCalculator, useToast } from '@/hooks';
import { createQuoteRequest } from '@/firebase/firestore';
import { formatCurrency } from '@/lib/utils';
import type { QuoteInput } from '@/types';

export default function Step5Review() {
  const { formData, setStep, setSubmittedQuoteId } = useQuote();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const quoteInput: Partial<QuoteInput> = {
    moveSize: formData.moveSize || undefined,
    serviceType: formData.serviceType || undefined,
    originCity: formData.originCity,
    destinationCity: formData.destinationCity,
    needsPacking: formData.needsPacking,
    needsStorage: formData.needsStorage,
    hasSpecialtyItems: formData.hasSpecialtyItems,
    floorOrigin: formData.floorOrigin,
    floorDestination: formData.floorDestination,
    hasElevator: formData.hasElevator,
  };

  const estimate = useQuoteCalculator(quoteInput);

  async function handleSubmit() {
    if (!formData.moveSize || !formData.serviceType) return;
    setLoading(true);
    try {
      const quote = await createQuoteRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        moveDate: formData.moveDate,
        moveSize: formData.moveSize,
        serviceType: formData.serviceType,
        originAddress: formData.originAddress,
        originCity: formData.originCity,
        destinationAddress: formData.destinationAddress,
        destinationCity: formData.destinationCity,
        needsPacking: formData.needsPacking,
        needsStorage: formData.needsStorage,
        hasSpecialtyItems: formData.hasSpecialtyItems,
        specialtyDetails: formData.specialtyDetails,
        floorOrigin: formData.floorOrigin,
        floorDestination: formData.floorDestination,
        hasElevator: formData.hasElevator,
        notes: formData.notes,
        estimatedHours: estimate?.estimatedHours,
        estimatedPrice: estimate?.totalMin,
        depositAmount: estimate?.depositAmount,
      });
      setSubmittedQuoteId(quote.id);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const rows = [
    ['Name', formData.name],
    ['Email', formData.email],
    ['Phone', formData.phone],
    ['Move Size', formData.moveSize],
    ['Service Type', formData.serviceType],
    ['Move Date', formData.moveDate],
    ['From', `${formData.originAddress}, ${formData.originCity}`],
    ['To', `${formData.destinationAddress}, ${formData.destinationCity}`],
    ['Packing Service', formData.needsPacking ? 'Yes' : 'No'],
    ['Storage', formData.needsStorage ? 'Yes' : 'No'],
    ['Specialty Items', formData.hasSpecialtyItems ? 'Yes' : 'No'],
  ].filter(([, v]) => v);

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-white text-2xl mb-1 tracking-wide">Review & Submit</h2>
      <p className="text-text-muted text-sm mb-6">Review your move details and price estimate before submitting.</p>

      {/* Summary */}
      <div className="bg-bg border border-border rounded-xl divide-y divide-border mb-6">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between px-4 py-2.5">
            <span className="text-text-muted text-sm">{label}</span>
            <span className="text-text-primary text-sm capitalize">{value}</span>
          </div>
        ))}
      </div>

      {/* Price Estimate */}
      {estimate && (
        <div className="bg-primary/10 border border-primary/40 rounded-xl p-5 mb-6">
          <p className="text-primary text-xs font-mono tracking-widest uppercase mb-3">Price Estimate</p>
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-sm"><span className="text-text-muted">Base price</span><span className="text-white">{formatCurrency(estimate.basePrice)}</span></div>
            {estimate.packingFee > 0 && <div className="flex justify-between text-sm"><span className="text-text-muted">Packing service</span><span className="text-white">{formatCurrency(estimate.packingFee)}</span></div>}
            {estimate.storageFee > 0 && <div className="flex justify-between text-sm"><span className="text-text-muted">Storage</span><span className="text-white">{formatCurrency(estimate.storageFee)}/mo</span></div>}
            {estimate.specialtyFee > 0 && <div className="flex justify-between text-sm"><span className="text-text-muted">Specialty items</span><span className="text-white">{formatCurrency(estimate.specialtyFee)}</span></div>}
            {estimate.floorFee > 0 && <div className="flex justify-between text-sm"><span className="text-text-muted">Floor surcharge</span><span className="text-white">{formatCurrency(estimate.floorFee)}</span></div>}
            {estimate.longDistanceFee > 0 && <div className="flex justify-between text-sm"><span className="text-text-muted">Long-distance fee</span><span className="text-white">{formatCurrency(estimate.longDistanceFee)}</span></div>}
          </div>
          <div className="border-t border-primary/30 pt-3 flex justify-between items-center">
            <span className="text-text-muted text-sm">Estimated Total</span>
            <span className="text-primary font-heading text-xl">{formatCurrency(estimate.totalMin)} – {formatCurrency(estimate.totalMax)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-text-muted text-sm">Deposit (20%)</span>
            <span className="text-white font-heading text-lg">{formatCurrency(estimate.depositAmount)}</span>
          </div>
          <p className="text-text-muted text-xs mt-3">Final price confirmed after coordinator review. ±15% range.</p>
        </div>
      )}

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep(4)} className="btn-outline">← Back</button>
        <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary min-w-[160px]">
          {loading ? 'Submitting...' : 'Submit Quote Request'}
        </button>
      </div>
    </div>
  );
}
