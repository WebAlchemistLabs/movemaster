import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionHeader from '@/components/ui/SectionHeader';
import { cities } from '@/data';
import { MapPin, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Coverage Cities',
  description: 'MoveMaster Pro serves 15 cities across Southern Ontario. Find local moving services in your city.',
};

export default function CitiesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="bg-surface py-16 border-b border-border">
          <div className="container-custom">
            <SectionHeader eyebrow="15 Cities. One Company." title="WHERE WE MOVE" subtitle="From Toronto to Windsor, Hamilton to Barrie our GPS tracked fleet and experienced crews cover all of Southern Ontario." />
          </div>
        </div>
        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cities.map((city) => (
                <Link key={city.id} href={`/cities/${city.slug}`} className="group block bg-surface border border-border rounded-xl overflow-hidden card-hover">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={city.image} alt={city.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
                    {city.popular && <span className="absolute top-3 right-3 bg-primary text-white text-xs font-mono-custom px-2 py-0.5 rounded-full">Popular</span>}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-mono-custom text-white/70 bg-black/40 px-2 py-0.5 rounded">{city.region}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-heading text-xl text-text-primary">{city.name}</h2>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        <Star size={11} className="fill-amber-400" /> {city.averageRating}
                      </div>
                    </div>
                    <p className="text-text-muted text-xs leading-relaxed mb-3 line-clamp-2">{city.description}</p>
                    <p className="text-xs text-primary font-mono-custom">{city.moveCount.toLocaleString()}+ moves completed</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
