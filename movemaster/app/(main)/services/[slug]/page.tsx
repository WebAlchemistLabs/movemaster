import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { services, crew, faqs } from '@/data';
import { formatCurrency } from '@/lib/utils';
import Accordion from '@/components/ui/Accordion';

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};
  return { title: `${service.name} Moving Service`, description: service.description };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const serviceCrew = crew.filter((m) => m.specialties.some((sp) => sp.toLowerCase().includes(service.serviceType.replace('-', ' ')))).slice(0, 3);
  const serviceFaqs = faqs.filter((f) => f.category === 'pricing' || f.category === 'booking').slice(0, 5);
  const priceUnit = service.priceUnit === 'hour' ? '/hr' : service.priceUnit === 'per-room' ? '/room' : ' flat';

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative h-72 md:h-96">
          <Image src={service.image} alt={service.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/70 to-transparent" />
          <div className="absolute inset-0 flex items-end pb-12">
            <div className="container-custom">
              <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-2">MoveMaster Pro</p>
              <h1 className="font-heading text-5xl md:text-6xl text-white">{service.name}</h1>
              <p className="text-text-muted mt-2">Starting from <span className="text-primary font-heading text-2xl">{formatCurrency(service.basePrice)}</span>{priceUnit}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-4">ABOUT THIS SERVICE</h2>
                  <p className="text-text-muted leading-relaxed text-lg">{service.longDescription}</p>
                </div>
                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-6">WHAT&apos;S INCLUDED</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {service.includes.map((item) => (
                      <div key={item} className="flex items-start gap-2 text-text-muted text-sm">
                        <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" /> {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-4">AVAILABLE ADD-ONS</h2>
                  <ul className="space-y-2">
                    {service.addOns.map((a) => (
                      <li key={a} className="flex items-center gap-2 text-text-muted text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-6">FAQ</h2>
                  <Accordion items={serviceFaqs} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  <div className="bg-surface border border-border rounded-xl p-6">
                    <p className="text-text-muted text-sm mb-1">Starting from</p>
                    <p className="font-heading text-4xl text-primary">{formatCurrency(service.basePrice)}<span className="text-text-muted text-xl font-body">{priceUnit}</span></p>
                    {service.minHours && <p className="text-text-muted text-xs mt-1">{service.minHours}-hour minimum</p>}
                    <p className="text-text-muted text-xs mt-2 mb-5">Fuel surcharge and basic insurance included. Final price based on move details.</p>
                    <Link href="/quote" className="w-full block bg-primary hover:bg-primary-hover text-white font-heading tracking-wider uppercase text-center py-4 rounded-sm transition-colors mb-3">
                      Get Free Quote
                    </Link>
                    <a href="tel:+18006683627" className="w-full block border border-border hover:border-primary text-text-muted hover:text-primary font-heading tracking-wider uppercase text-center py-3 rounded-sm transition-colors text-sm">
                      Call 1-800-MOVEMASTER
                    </a>
                  </div>
                  {serviceCrew.length > 0 && (
                    <div className="bg-surface border border-border rounded-xl p-6">
                      <h3 className="font-heading text-xl text-text-primary mb-4">SPECIALIST CREW</h3>
                      <div className="space-y-3">
                        {serviceCrew.map((m) => (
                          <Link key={m.id} href={`/crew/${m.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0">
                              <Image src={m.photo} alt={m.name} fill className="object-cover" />
                            </div>
                            <div>
                              <p className="text-text-primary text-sm font-medium">{m.name}</p>
                              <p className="text-text-muted text-xs">{m.yearsExperience} yrs • {m.rating} ★</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
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
