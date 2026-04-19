'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUserProfile } from '@/firebase/firestore';
import { useToast } from '@/hooks';
import { cities } from '@/data';
import { User } from 'lucide-react';

export default function DashboardProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    displayName: user?.displayName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    preferredCity: user?.preferredCity ?? '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    await updateUserProfile(user.uid, form);
    toast.success('Profile updated successfully.');
    setLoading(false);
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl text-white">PROFILE SETTINGS</h1>
        <p className="text-text-muted text-sm mt-1">Update your account information and preferences.</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center">
          <User size={28} className="text-primary" />
        </div>
        <div>
          <p className="text-white font-heading text-xl">{user?.displayName}</p>
          <p className="text-text-muted text-sm">{user?.email}</p>
          {user?.uid === 'demo-user-001' && (
            <span className="text-xs bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 rounded-full mt-1 inline-block font-mono">
              Demo Account
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="label-dark">Full Name</label>
            <input className="input-dark" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
          </div>
          <div>
            <label className="label-dark">Phone Number</label>
            <input type="tel" className="input-dark" placeholder="416-555-0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="label-dark">Email Address</label>
          <input type="email" className="input-dark" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label-dark">Preferred City</label>
          <select className="input-dark" value={form.preferredCity} onChange={(e) => setForm({ ...form, preferredCity: e.target.value })}>
            <option value="">Select city...</option>
            {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className="pt-2">
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Account info */}
      <div className="mt-6 bg-surface border border-border rounded-2xl p-6">
        <h2 className="font-heading text-xl text-white mb-4">ACCOUNT INFO</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-text-muted">Member Since</span>
            <span className="text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long' }) : 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-text-muted">Account ID</span>
            <span className="text-white font-mono text-xs">{user?.uid?.substring(0, 12)}...</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-text-muted">Account Type</span>
            <span className="text-white">{user?.uid === 'demo-user-001' ? 'Demo' : 'Standard'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
