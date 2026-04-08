'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, FileText, Calendar, User, Truck, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/quotes', label: 'My Quotes', icon: <FileText size={18} /> },
  { href: '/dashboard/bookings', label: 'Bookings', icon: <Calendar size={18} /> },
  { href: '/dashboard/profile', label: 'Profile', icon: <User size={18} /> },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex-col hidden md:flex">
        <Link href="/" className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
            <Truck size={16} className="text-white" />
          </div>
          <span className="font-heading text-base text-white">MOVEMASTER <span className="text-primary">PRO</span></span>
        </Link>

        <div className="px-4 py-5 border-b border-border">
          <p className="text-text-muted text-xs uppercase tracking-wider font-mono mb-1">Signed in as</p>
          <p className="text-white font-body text-sm font-medium">{user.displayName}</p>
          <p className="text-text-muted text-xs">{user.email}</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-1 transition-colors',
                  active ? 'bg-primary/15 text-primary border border-primary/30' : 'text-text-muted hover:text-white hover:bg-white/5'
                )}
              >
                {item.icon}
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-2">
          <Link href="/quote" className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading tracking-wider uppercase text-xs px-3 py-2.5 rounded-sm transition-colors">
            + New Quote
          </Link>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-2 text-text-muted hover:text-red-400 text-sm w-full px-3 py-2 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="font-heading text-white text-base">MOVEMASTER <span className="text-primary">PRO</span></Link>
          <div className="flex gap-3">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={cn('p-2 rounded-lg transition-colors', pathname === item.href ? 'text-primary' : 'text-text-muted')}>
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 md:overflow-auto">
        <div className="pt-16 md:pt-0 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
