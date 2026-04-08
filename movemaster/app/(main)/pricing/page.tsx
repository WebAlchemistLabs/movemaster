import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PriceCalculator from '@/components/quote/PriceCalculator';
import { pricingTiers, faqs } from '@/data';

export const metadata: Metadata = {
  title: 'Moving Prices & Rates',
  description: 'Transparent moving prices for Southern Ontario. No hidden fees. Use our live calculator to estimate your move cost instantly.',
};

export default function PricingPage() {
  const pricingFaqs = faqs.filter((f) => f.category === 'pricing');

  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Transparent Pricing</p>
            <h1 className="font-heading text-5xl md:text-6xl text-white mb-4">NO HIDDEN FEES. EVER.</h1>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              Every quote shows exactly what you pay. Fuel surcharge included. No surprise charges on moving day.
            </p>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-4xl text-white">CHOOSE YOUR PACKAGE</h2>
              <p className="text-text-muted mt-3">All packages include truck, crew, fuel, and basic insurance.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {pricingTiers.map((tier) => (
                <div key={tier.id} className={`relative rounded-xl border p-8 flex flex-col ${tier.popular ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
                  {tier.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-mono px-4 py-1 rounded-full tracking-wider">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="font-heading text-2xl text-white mb-1">{tier.name}</h3>
                  <p className="text-text-muted text-sm mb-6 leading-relaxed">{tier.description}</p>
                  <div className="mb-6">
                    <span className="font-heading text-5xl text-primary">${tier.baseRate}</span>
                    <span className="text-text-muted text-lg">/hr</span>
                    <p className="text-xs text-text-muted mt-1">Starting rate — final price based on home size</p>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-text-muted">
                        <CheckCircle size={15} className="text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/quote" className={`font-heading tracking-wider uppercase text-center py-3.5 rounded-sm transition-colors ${tier.popular ? 'bg-primary hover:bg-primary-hover text-white' : 'border border-primary text-primary hover:bg-primary hover:text-white'}`}>
                    Get Quote
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-text-muted text-sm">
              All pricing includes fuel surcharge and basic transit insurance. GST/HST not included in displayed rates.
            </p>
          </div>
        </section>

        {/* Rate Table */}
        <section className="section-pad bg-surface">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading text-4xl text-white">BASE HOURLY RATES</h2>
              <p className="text-text-muted mt-2">Rates by home size. 3-hour minimum on all residential moves.</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full">
                <thead className="bg-bg border-b border-border">
                  <tr>
                    {['Home Size', 'Crew', 'Hourly Rate', 'Est. Hours', 'Est. Total'].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-text-muted text-xs font-mono tracking-wider uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { size: 'Studio', crew: '2 movers', rate: 129, hours: '2–3 hrs', est: '$260–$390' },
                    { size: '1 Bedroom', crew: '2 movers', rate: 149, hours: '3–4 hrs', est: '$450–$600' },
                    { size: '2 Bedroom', crew: '3 movers', rate: 169, hours: '4–6 hrs', est: '$680–$1,020' },
                    { size: '3 Bedroom', crew: '3–4 movers', rate: 199, hours: '6–8 hrs', est: '$1,200–$1,600' },
                    { size: '4 Bedroom', crew: '4–5 movers', rate: 249, hours: '8–12 hrs', est: '$2,000–$3,000' },
                    { size: 'Small Office', crew: '3 movers', rate: 189, hours: '5–7 hrs', est: '$950–$1,330' },
                    { size: 'Large Office', crew: '4–6 movers', rate: 229, hours: '8–14 hrs', est: '$1,830–$3,200' },
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4 text-white font-body text-sm">{row.size}</td>
                      <td className="px-5 py-4 text-text-muted text-sm">{row.crew}</td>
                      <td className="px-5 py-4 text-primary font-heading text-lg">${row.rate}<span className="text-text-muted text-xs font-body">/hr</span></td>
                      <td className="px-5 py-4 text-text-muted text-sm">{row.hours}</td>
                      <td className="px-5 py-4 text-white text-sm font-body">{row.est}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Long-Distance Rates */}
        <section className="section-pad bg-bg">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading text-4xl text-white">LONG-DISTANCE ADD-ONS</h2>
              <p className="text-text-muted mt-2">Added to your base hourly rate for moves beyond city limits.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { range: 'Within 100km', fee: '+$200', example: 'Toronto → Hamilton' },
                { range: '100 – 250km', fee: '+$500', example: 'Toronto → London' },
                { range: '250km+', fee: '+$900', example: 'Toronto → Windsor' },
              ].map((row) => (
                <div key={row.range} className="bg-surface border border-border rounded-xl p-6">
                  <p className="text-text-muted text-sm mb-1">{row.range}</p>
                  <p className="font-heading text-3xl text-primary mb-1">{row.fee}</p>
                  <p className="text-text-muted text-xs">{row.example}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Calculator */}
        <section className="section-pad bg-surface">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Try It Now</p>
              <h2 className="font-heading text-4xl text-white">INSTANT PRICE CALCULATOR</h2>
              <p className="text-text-muted mt-3">Get a real-time estimate based on your specific move details.</p>
            </div>
            <PriceCalculator />
          </div>
        </section>

        {/* FAQ */}
        <section className="section-pad bg-bg">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="font-heading text-4xl text-white">PRICING FAQ</h2>
            </div>
            <div className="space-y-4">
              {pricingFaqs.map((faq) => (
                <details key={faq.id} className="group bg-surface border border-border rounded-xl p-5">
                  <summary className="font-heading text-white text-base cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-primary group-open:rotate-45 transition-transform text-2xl ml-4 shrink-0">+</span>
                  </summary>
                  <p className="text-text-muted text-sm leading-relaxed mt-4">{faq.answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-text-muted mb-4">Still have questions about pricing?</p>
              <div className="flex gap-3 justify-center">
                <Link href="/contact" className="btn-outline">Contact Us</Link>
                <Link href="/quote" className="btn-primary">Get Your Quote</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
