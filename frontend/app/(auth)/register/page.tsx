'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match.'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success('Account created! Welcome to MoveMaster Pro.');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <span className="font-heading text-xl text-white">MOVEMASTER <span className="text-primary">PRO</span></span>
        </Link>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <h1 className="font-heading text-3xl text-white mb-1">CREATE ACCOUNT</h1>
          <p className="text-text-muted text-sm mb-8">Track your quotes and bookings in one place.</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="label-dark">Full Name</label>
              <input required className="input-dark" placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label-dark">Email Address</label>
              <input type="email" required className="input-dark" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label-dark">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required className="input-dark pr-10" placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label-dark">Confirm Password</label>
              <input type={show ? 'text' : 'password'} required className="input-dark" placeholder="Repeat password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
