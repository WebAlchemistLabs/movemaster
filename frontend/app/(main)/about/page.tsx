import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Award, Users, Truck, Heart, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { companyStats } from '@/data';

export const metadata: Metadata = {
  title: 'About MoveMaster Pro',
  description: "Southern Ontario's most trusted moving company since 2010. Learn our story, our values, and the team behind 12,400+ successful moves.",
};

const milestones = [
  { year: '2010', title: 'Founded in Hamilton', desc: 'Started with 1 truck and 2 crew members. First move: a 2-bedroom apartment in downtown Hamilton.' },
  { year: '2012', title: 'GTA Expansion', desc: 'Opened our Toronto base of operations. Crew grew to 8. Added our first commercial moving service.' },
  { year: '2015', title: '1,000th Move', desc: 'Hit the milestone of 1,000 completed moves. Celebrated by cutting our rates for 30 days.' },
  { year: '2017', title: 'Waterloo Region Launch', desc: 'Expanded into Kitchener, Waterloo, and Cambridge with a dedicated local crew.' },
  { year: '2019', title: 'Senior Move Certification', desc: 'Launched our Gentle Transition senior moving service after training 6 specialist crew leads.' },
  { year: '2021', title: 'Fleet Expansion', desc: 'Added 5 new GPS-tracked trucks and grew crew to 35 members across Southern Ontario.' },
  { year: '2024', title: 'Today', desc: '48 crew members. 15 cities. 12,400+ moves. Still the same commitment to treating your belongings like our own.' },
];

const values = [
  { icon: <Heart size={24} />, title: 'Care Above All', desc: 'We treat every item we move as if it were our own. That grandmother\'s china matters as much to us as it does to you.' },
  { icon: <Shield size={24} />, title: 'Radical Transparency', desc: 'No hidden fees. No surprise charges. Every quote is a detailed breakdown of exactly what you will pay.' },
  { icon: <Users size={24} />, title: 'People First', desc: 'Moving is about people, not furniture. We invest in our crew and our clients in equal measure.' },
  { icon: <Award size={24} />, title: 'Excellence Standard', desc: 'We hold ourselves to a 97% on-time rate and a 4.9-star average. We track both, constantly.' },
  { icon: <Truck size={24} />, title: 'Community Roots', desc: 'We are Southern Ontario through and through. We live here, work here, and invest in these communities.' },
  { icon: <CheckCircle size={24} />, title: 'Every Move Counts', desc: 'From a studio apartment to a 40-person office, every move gets our full professionalism and attention.' },
];

const fleet = [
  { type: 'Cargo Van', count: 4, desc: 'Studio and 1-bedroom moves. Ideal for downtown Toronto tight streets.' },
  { type: '16 ft Box Truck', count: 8, desc: '1–2 bedroom apartments. Our most versatile workhorse vehicle.' },
  { type: '24 ft Box Truck', count: 9, desc: '2–3 bedroom homes. Fits most household moves in a single load.' },
  { type: '26 ft Moving Truck', count: 6, desc: '4-bedroom homes and large commercial moves. Full air-ride suspension.' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen">
        {/* Hero */}
        <section className="relative min-h-[60vh] flex items-end pb-16 pt-32 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&h=900&fit=crop"
            alt="MoveMaster Pro team"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/30" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Our Story</p>
            <h1 className="font-heading text-5xl md:text-7xl text-white mb-4">14 YEARS OF<br /><span className="text-primary">MOVING ONTARIO.</span></h1>
            <p className="text-text-muted text-lg max-w-2xl">
              We started with one truck, two guys, and a belief that moving should not be something people dread. That belief has not changed. Only the scale has.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
              {Object.entries(companyStats).map(([key, val]) => {
                const labels: Record<string, string> = { totalMoves: 'Total Moves', yearsInBusiness: 'Years Active', citiesCovered: 'Cities', customerRating: 'Avg Rating', crewMembers: 'Crew', onTimeRate: 'On-Time Rate' };
                return (
                  <div key={key}>
                    <p className="font-heading text-2xl md:text-3xl text-white">{val}</p>
                    <p className="text-white/70 text-xs font-mono uppercase tracking-wider mt-0.5">{labels[key]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="section-pad">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">The Beginning</p>
                <h2 className="font-heading text-4xl text-white mb-6">FROM ONE TRUCK TO 48 CREW MEMBERS</h2>
                <div className="space-y-4 text-text-muted leading-relaxed">
                  <p>MoveMaster Pro was founded in 2010 by two Hamilton locals who had just helped each other move and realized the professional moving companies they had hired were overpriced, careless, and impossible to communicate with.</p>
                  <p>They bought a used box truck, got their CVOR license, and started doing moves for family and friends. Word spread fast. Within six months they were booked solid every weekend. Within a year, they hired their first crew member.</p>
                  <p>Fourteen years later, MoveMaster Pro has completed over 12,400 moves across 15 Southern Ontario cities with a crew of 48 background-checked professionals. But the commitment that started on day one has never changed: treat every client&apos;s belongings like your own.</p>
                </div>
              </div>
              <div className="relative h-80 lg:h-full min-h-[320px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1590496793929-36417d3117de?w=700&h=900&fit=crop"
                  alt="Moving crew at work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-pad bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">What We Stand For</p>
              <h2 className="font-heading text-4xl md:text-5xl text-white">OUR VALUES</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-bg border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center text-primary mb-4">
                    {v.icon}
                  </div>
                  <h3 className="font-heading text-xl text-white mb-2">{v.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="section-pad">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Our Journey</p>
              <h2 className="font-heading text-4xl md:text-5xl text-white">MILESTONES</h2>
            </div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-10">
                {milestones.map((m) => (
                  <div key={m.year} className="flex gap-8 pl-4">
                    <div className="relative">
                      <div className="w-5 h-5 bg-primary rounded-full border-2 border-bg shrink-0 mt-1" />
                    </div>
                    <div>
                      <span className="text-primary font-mono text-sm tracking-wider">{m.year}</span>
                      <h3 className="font-heading text-xl text-white mt-0.5 mb-1">{m.title}</h3>
                      <p className="text-text-muted text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Fleet */}
        <section className="section-pad bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Our Equipment</p>
              <h2 className="font-heading text-4xl text-white">THE FLEET</h2>
              <p className="text-text-muted mt-3">27 GPS-tracked vehicles. All CVOR licensed. All regularly inspected and maintained.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {fleet.map((f) => (
                <div key={f.type} className="bg-bg border border-border rounded-xl p-5 text-center">
                  <Truck size={32} className="text-primary mx-auto mb-3" />
                  <h3 className="font-heading text-lg text-white mb-1">{f.type}</h3>
                  <p className="text-primary font-heading text-2xl mb-2">{f.count}</p>
                  <p className="text-text-muted text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="section-pad">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Credentials</p>
            <h2 className="font-heading text-4xl text-white mb-10">LICENSED & CERTIFIED</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { title: 'CVOR Licensed', desc: 'Commercial Vehicle Operator Registration with a clean record' },
                { title: 'WSIB Covered', desc: 'Full Workplace Safety & Insurance coverage for all crew' },
                { title: 'AMSA Members', desc: 'American Moving & Storage Association certified practices' },
                { title: '$2M Insured', desc: 'Comprehensive general liability insurance up to $2 million' },
              ].map((c) => (
                <div key={c.title} className="bg-surface border border-border rounded-xl p-5">
                  <CheckCircle size={24} className="text-primary mx-auto mb-3" />
                  <h3 className="font-heading text-base text-white mb-1">{c.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-5xl text-white mb-4">JOIN THE 12,400+</h2>
            <p className="text-white/80 mb-8">Families and businesses across Southern Ontario who trust MoveMaster Pro.</p>
            <Link href="/quote" className="bg-white text-primary hover:bg-gray-100 font-heading tracking-wider uppercase px-10 py-4 rounded-sm transition-colors text-lg">
              Get Free Quote
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
