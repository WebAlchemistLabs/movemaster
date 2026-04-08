'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Truck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks';

export default function LoginPage() {
  const router = useRouter();
  const { login, demoLogin } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    setLoading(true);
    await demoLogin();
    toast.success('Signed in as Demo User');
    router.push('/dashboard');
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <span className="font-heading text-xl text-white">MOVEMASTER <span className="text-primary">PRO</span></span>
        </Link>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <h1 className="font-heading text-3xl text-white mb-1">SIGN IN</h1>
          <p className="text-text-muted text-sm mb-8">Welcome back. Enter your credentials below.</p>

          {/* Demo Login */}
          <button onClick={handleDemo} disabled={loading} className="w-full bg-primary/10 border border-primary/40 text-primary font-heading tracking-wider uppercase py-3 rounded-sm hover:bg-primary/20 transition-colors mb-6">
            Sign In as Demo User
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-text-muted text-xs">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label-dark">Email Address</label>
              <input type="email" required className="input-dark" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="label-dark">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required className="input-dark pr-10" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white" onClick={() => setShow(!show)}>
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-text-muted text-xs hover:text-primary transition-colors">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-text-muted text-sm mt-6">
            No account yet?{' '}
            <Link href="/register" className="text-primary hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
