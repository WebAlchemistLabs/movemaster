import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Truck } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center pt-20 pb-16">
        <div className="text-center px-4">
          <div className="w-24 h-24 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-6">
            <Truck size={40} className="text-primary" />
          </div>
          <h1 className="font-heading text-6xl md:text-8xl text-text-primary mb-4">404</h1>
          <p className="font-heading text-2xl text-text-muted mb-2">This Page Has Moved</p>
          <p className="text-text-muted mb-8 max-w-sm mx-auto">Looks like this page relocated without us. Let us help you find where you need to go.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-primary hover:bg-primary-hover text-white font-heading tracking-wider uppercase px-8 py-4 rounded-sm transition-colors">Go Home</Link>
            <Link href="/quote" className="border border-primary text-primary hover:bg-primary hover:text-white font-heading tracking-wider uppercase px-8 py-4 rounded-sm transition-colors">Get a Quote</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
