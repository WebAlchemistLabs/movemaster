'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Truck, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks';
import { resetPassword } from '@/firebase/auth';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await resetPassword(email);
    setSent(true);
    toast.success('Reset email sent (demo mode — no actual email sent)');
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <span className="font-heading text-xl text-white">MOVEMASTER <span className="text-primary">PRO</span></span>
        </Link>

        <div className="bg-surface border border-border rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-900/40 border border-green-600 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <h2 className="font-heading text-2xl text-white mb-2">CHECK YOUR EMAIL</h2>
              <p className="text-text-muted text-sm mb-6">If an account exists for {email}, a reset link has been sent. Check your spam folder if you don&apos;t see it.</p>
              <Link href="/login" className="btn-primary w-full py-3 block text-center">Back to Sign In</Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-3xl text-white mb-1">RESET PASSWORD</h1>
              <p className="text-text-muted text-sm mb-8">Enter your email and we will send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-dark">Email Address</label>
                  <input type="email" required className="input-dark" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <p className="text-center text-text-muted text-sm mt-6">
                <Link href="/login" className="text-primary hover:underline">Back to sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
