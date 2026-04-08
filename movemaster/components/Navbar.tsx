'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useScrolled } from '@/hooks';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Truck, ChevronDown, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Cities', href: '/cities' },
  { label: 'Crew', href: '/crew' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const scrolled = useScrolled(60);
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      scrolled ? 'bg-bg/95 backdrop-blur-md border-b border-border shadow-lg' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-sm flex items-center justify-center group-hover:bg-primary-hover transition-colors">
              <Truck size={20} className="text-white" />
            </div>
            <div>
              <span className="font-heading text-xl text-text-primary tracking-wider">MOVEMASTER</span>
              <span className="font-heading text-xl text-primary tracking-wider"> PRO</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-text-muted hover:text-text-primary text-sm font-body transition-colors">
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA + User */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors">
                  <User size={16} />
                  <span className="text-sm">{user.displayName.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-surface border border-border rounded-lg shadow-xl overflow-hidden">
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>Dashboard</Link>
                    <Link href="/dashboard/quotes" className="block px-4 py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors" onClick={() => setUserMenuOpen(false)}>My Quotes</Link>
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-sm text-text-muted hover:text-text-primary transition-colors">Sign In</Link>
            )}
            <Link href="/quote" className="bg-primary hover:bg-primary-hover text-white font-heading text-sm tracking-wider uppercase px-5 py-2.5 rounded-sm transition-colors">
              Get Free Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-text-primary" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-4 py-4 flex flex-col gap-4">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-text-muted hover:text-primary py-2 border-b border-border/50 transition-colors" onClick={() => setMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" className="text-text-muted hover:text-primary py-2 border-b border-border/50" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left text-red-400 py-2">Sign Out</button>
              </>
            ) : (
              <Link href="/login" className="text-text-muted hover:text-primary py-2 border-b border-border/50" onClick={() => setMenuOpen(false)}>Sign In</Link>
            )}
            <Link href="/quote" className="bg-primary text-white font-heading tracking-wider uppercase text-center py-3 rounded-sm" onClick={() => setMenuOpen(false)}>
              Get Free Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
