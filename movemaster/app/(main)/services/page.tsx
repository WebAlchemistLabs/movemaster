import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/services/ServiceCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { services } from '@/data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Moving Services',
  description: 'Residential, commercial, long-distance, packing, storage, specialty, last-minute, and senior moving services across Southern Ontario.',
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="bg-surface py-16 border-b border-border">
          <div className="container-custom">
            <SectionHeader eyebrow="What We Offer" title="MOVING SERVICES" subtitle="Eight specialized moving services built for every situation from a studio move to a 20 person office relocation. Professional crew, transparent pricing, and zero hidden fees." />
          </div>
        </div>
        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        </section>
        <section className="py-16 bg-primary">
          <div className="container-custom text-center">
            <h2 className="font-heading text-4xl text-white mb-4">NOT SURE WHICH SERVICE YOU NEED?</h2>
            <p className="text-white/80 mb-6">Our coordinators will help you choose the right package for your specific move.</p>
            <Link href="/contact" className="bg-white text-primary font-heading tracking-wider uppercase px-8 py-4 rounded-sm hover:bg-gray-100 transition-colors">Talk to a Coordinator</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
