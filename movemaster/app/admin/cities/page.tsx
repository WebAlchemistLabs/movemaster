import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star, ArrowRight } from 'lucide-react';
import { cities } from '@/data';
import Navbar from '@/components/Navbar';

const regionColors: Record<string, string> = {
  'GTA': 'bg-blue-900/40 text-blue-400 border-blue-800',
  'Hamilton-Halton': 'bg-green-900/40 text-green-400 border-green-800',
  'Waterloo Region': 'bg-purple-900/40 text-purple-400 border-purple-800',
  'Southwestern Ontario': 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  'Niagara': 'bg-orange-900/40 text-orange-400 border-orange-800',
  'Central Ontario': 'bg-red-900/40 text-red-400 border-red-800',
};

export default function AdminCitiesPage() {
  const regions = [...new Set(cities.map((c) => c.region))];
  const totalMoves = cities.reduce((s, c) => s + c.moveCount, 0);
  const avgRating = cities.reduce((s, c) => s + c.averageRating, 0) / cities.length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-text-muted hover:text-primary transition-colors"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-heading text-3xl text-white">COVERAGE AREAS</h1>
              <p className="text-text-muted text-sm">{cities.length} active service cities across Southern Ontario</p>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Cities', value: cities.length },
              { label: 'Total Regions', value: regions.length },
              { label: 'Total Moves', value: totalMoves.toLocaleString() + '+' },
              { label: 'Avg Rating', value: avgRating.toFixed(1) + ' ★' },
            ].map((s) => (
              <div key={s.label} className="bg-surface border border-border rounded-xl p-4 text-center">
                <p className="font-heading text-3xl text-primary">{s.value}</p>
                <p className="text-text-muted text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* By Region */}
          {regions.map((region) => {
            const regionCities = cities.filter((c) => c.region === region);
            return (
              <div key={region} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-mono border px-3 py-1 rounded-full ${regionColors[region] ?? 'bg-surface border-border text-text-muted'}`}>
                    {region}
                  </span>
                  <span className="text-text-muted text-sm">{regionCities.length} cities</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionCities.map((city) => (
                    <div key={city.id} className="bg-surface border border-border rounded-xl overflow-hidden">
                      <div className="relative h-32">
                        <Image src={city.image} alt={city.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
                        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                          <div>
                            <h3 className="font-heading text-lg text-white">{city.name}</h3>
                            {city.popular && <span className="text-primary text-xs font-mono">Popular</span>}
                          </div>
                          <div className="flex items-center gap-1 bg-bg/80 px-2 py-0.5 rounded">
                            <Star size={10} className="text-amber-400 fill-amber-400" />
                            <span className="text-white text-xs">{city.averageRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-text-muted text-xs">
                            <MapPin size={11} className="text-primary" />
                            {city.moveCount}+ moves
                          </div>
                        </div>
                        <p className="text-text-muted text-xs leading-relaxed line-clamp-2 mb-3">{city.description}</p>
                        <div className="flex gap-2">
                          <Link href={`/cities/${city.slug}`} className="text-xs text-primary border border-primary/40 px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-colors flex items-center gap-1">
                            View Page <ArrowRight size={11} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
