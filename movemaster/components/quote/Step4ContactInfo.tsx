'use client';

import { useQuote } from '@/context/QuoteContext';

const hearOptions = ['Google Search', 'Facebook/Instagram', 'Friend or Family', 'Kijiji', 'Flyer or Sign', 'Previous Customer', 'Other'];

export default function Step4ContactInfo() {
  const { formData, updateForm, setStep } = useQuote();
  const valid = formData.name && formData.email && formData.phone;

  return (
    <div className="animate-fade-in-up">
      <h2 className="font-heading text-white text-2xl mb-1 tracking-wide">Your Information</h2>
      <p className="text-text-muted text-sm mb-6">Almost done — we need your contact info to send your quote.</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="label-dark">Full Name *</label>
          <input className="input-dark" placeholder="Jane Smith" value={formData.name} onChange={(e) => updateForm({ name: e.target.value })} />
        </div>
        <div>
          <label className="label-dark">Email Address *</label>
          <input type="email" className="input-dark" placeholder="jane@example.com" value={formData.email} onChange={(e) => updateForm({ email: e.target.value })} />
        </div>
        <div>
          <label className="label-dark">Phone Number *</label>
          <input type="tel" className="input-dark" placeholder="416-555-0100" value={formData.phone} onChange={(e) => updateForm({ phone: e.target.value })} />
        </div>
        <div>
          <label className="label-dark">How did you hear about us?</label>
          <select className="input-dark" value={formData.hearAboutUs} onChange={(e) => updateForm({ hearAboutUs: e.target.value })}>
            <option value="">Select one...</option>
            {hearOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <p className="text-text-muted text-xs mb-6">
        By submitting, you agree to be contacted by MoveMaster Pro regarding your quote. We never share your information.
      </p>

      <div className="flex justify-between">
        <button type="button" onClick={() => setStep(3)} className="btn-outline">← Back</button>
        <button type="button" onClick={() => setStep(5)} disabled={!valid} className="btn-primary">Review Quote →</button>
      </div>
    </div>
  );
}
