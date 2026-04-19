import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CrewCard from '@/components/crew/CrewCard';
import { cities, crew, services } from '@/data';

export async function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) return {};
  return {
    title: `Movers in ${city.name}, Ontario`,
    description: `Professional moving services in ${city.name}. Local and long-distance moves. Get your free quote today.`,
  };
}

const cityTips: Record<string, string[]> = {
  toronto: ['Book the freight elevator at your condo building at least 72 hours in advance — most buildings require this.', 'Apply for a temporary parking permit from the City of Toronto at toronto.ca at least 3 business days before your move.', 'Schedule your move start time early (7-8am) to beat downtown traffic on the Gardiner and DVP.'],
  mississauga: ['Confirm your building\'s loading dock hours with management — many Mississauga condos restrict moves to weekdays only.', 'If moving near Square One, note that traffic on Hurontario can be significant — early morning starts are best.', 'Keep your building superintendent\'s number handy for elevator access coordination on move day.'],
  default: ['Confirm building or complex moving rules and elevator booking requirements well in advance of your move date.', 'Apply for any required parking permits from your municipal office at least 3 business days before moving day.', 'Create a moving day essentials kit with snacks, phone chargers, and important documents you will need quick access to.'],
};

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();

  const cityCrew = crew.filter((m) => m.cities.includes(city.name)).slice(0, 4);
  const tips = cityTips[city.slug] ?? cityTips.default;

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="relative h-80 md:h-96">
          <Image src={city.image} alt={city.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent" />
          <div className="absolute inset-0 flex items-end pb-12">
            <div className="container-custom">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-primary" />
                <span className="text-text-muted text-sm font-mono-custom">{city.region}</span>
              </div>
              <h1 className="font-heading text-5xl md:text-6xl text-white mb-2">MOVING TO/FROM<br /><span className="text-primary">{city.name.toUpperCase()}</span></h1>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /> {city.averageRating} rating</span>
                <span>{city.moveCount.toLocaleString()}+ moves completed</span>
              </div>
            </div>
          </div>
        </div>

        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-4">ABOUT {city.name.toUpperCase()} MOVES</h2>
                  <p className="text-text-muted leading-relaxed text-lg">{city.description}</p>
                </div>
                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-4">SERVICES IN {city.name.toUpperCase()}</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {services.map((s) => (
                      <Link key={s.id} href={`/services/${s.slug}`} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-sm">
                        <CheckCircle size={14} className="text-primary shrink-0" /> {s.name} Moving
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-4">LOCAL MOVING TIPS FOR {city.name.toUpperCase()}</h2>
                  <div className="space-y-4">
                    {tips.map((tip, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-surface border border-border rounded-lg">
                        <span className="font-heading text-2xl text-primary/30 shrink-0">0{i+1}</span>
                        <p className="text-text-muted text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {cityCrew.length > 0 && (
                  <div>
                    <h2 className="font-heading text-3xl text-text-primary mb-6">CREW SERVING {city.name.toUpperCase()}</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {cityCrew.map((m) => <CrewCard key={m.id} member={m} />)}
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-surface border border-border rounded-xl p-6 mb-6">
                    <h3 className="font-heading text-xl text-text-primary mb-4">GET A {city.name.toUpperCase()} QUOTE</h3>
                    <p className="text-text-muted text-sm mb-5">Get a free, detailed quote for your {city.name} move in under 5 minutes.</p>
                    <Link href="/quote" className="block bg-primary hover:bg-primary-hover text-white font-heading tracking-wider uppercase text-center py-4 rounded-sm transition-colors mb-3 w-full">
                      Free Quote
                    </Link>
                    <a href="tel:+18006683627" className="block border border-border hover:border-primary text-text-muted hover:text-primary font-heading tracking-wider uppercase text-center py-3 rounded-sm transition-colors text-sm w-full">
                      1-800-MOVEMASTER
                    </a>
                  </div>
                  <div className="bg-surface border border-border rounded-xl p-5">
                    <p className="font-mono-custom text-xs text-primary uppercase tracking-wider mb-3">City Stats</p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Total Moves</span>
                        <span className="text-text-primary font-medium">{city.moveCount.toLocaleString()}+</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Avg. Rating</span>
                        <span className="text-text-primary font-medium">{city.averageRating} / 5.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Region</span>
                        <span className="text-text-primary font-medium">{city.region}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
