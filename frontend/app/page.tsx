import Link from 'next/link';
import Image from 'next/image';
import { Star, Shield, Clock, MapPin, ArrowRight, CheckCircle, Phone, Truck, Package, Home as HomeIcon, Building2, Warehouse, Zap, Heart, Users, Award, TrendingUp, Lock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/services/ServiceCard';
import CrewCard from '@/components/crew/CrewCard';
import { services, crew, cities, companyStats, pricingTiers } from '@/data';

const whyUs = [
  { icon: <Shield size={24} />, title: 'Fully Insured & Licensed', desc: 'CVOR licensed, WSIB covered, and insured up to $2 million. Your belongings are protected.' },
  { icon: <Truck size={24} />, title: 'GPS Tracked Trucks', desc: 'Every truck is GPS tracked. Share a live link with your family so everyone knows where your move is.' },
  { icon: <CheckCircle size={24} />, title: 'Background Checked Crew', desc: 'Every team member is background checked, referenced, and trained before their first job.' },
  { icon: <Package size={24} />, title: 'Free Padding & Wrapping', desc: 'Heavy blankets, stretch wrap, and protective materials are included in every move at no extra charge.' },
  { icon: <Phone size={24} />, title: 'Real Time Updates', desc: 'Your coordinator keeps you informed throughout the entire move. No radio silence, no surprises.' },
  { icon: <Award size={24} />, title: 'No Hidden Fees', desc: 'Our quotes show exactly what you pay. Fuel surcharge included. No surprise charges at the end.' },
];

const steps = [
  { num: '01', title: 'Get Your Free Quote', desc: 'Fill out our 5 step online form or call us. Get a detailed price breakdown in minutes.' },
  { num: '02', title: 'Book & Confirm', desc: 'Reserve your date with a 20% deposit. Your coordinator will call within 2 hours to confirm details.' },
  { num: '03', title: 'We Pack & Load', desc: 'Our crew arrives on time, wraps everything carefully, and loads your truck with military precision.' },
  { num: '04', title: 'Delivered Safe', desc: 'Everything arrives at your new home intact. We unload, reassemble furniture, and clean up.' },
];

export default function HomePage() {
  const featuredCrew = crew.filter((c) => c.featured);
  const recentPosts = [
    { slug: 'how-to-pack-kitchen-for-moving', title: '10 Pro Tips for Packing Your Kitchen Like a Moving Expert', excerpt: 'The kitchen is the hardest room to pack. Here is how our professional packers approach it.', category: 'tips', readTime: 6, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop' },
    { slug: 'moving-toronto-guide-2024', title: 'The Complete Guide to Moving in Toronto: What Nobody Tells You', excerpt: 'Parking permits, elevator bookings, building restrictions, everything you need to know.', category: 'local', readTime: 8, image: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800&h=500&fit=crop' },
    { slug: 'downsizing-guide-for-seniors', title: 'Downsizing After 60: A Compassionate Guide to Moving Less Stuff', excerpt: 'Letting go of decades of belongings is one of the hardest emotional challenges in moving.', category: 'guides', readTime: 7, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop' },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <Image src="https://i.pinimg.com/1200x/f6/ab/6a/f6ab6a61aa7573700bd412b612898bc7.jpg" alt="Moving truck on the highway" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/70 to-bg" />
          <div className="absolute inset-0 bg-gradient-to-r from-bg/60 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            <div className="max-w-3xl">
              <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-4">Southern Ontario&apos;s Most Trusted Movers</p>
              <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-text-primary leading-none mb-6">
                WE MOVE<br />
                <span className="text-primary">WHAT MATTERS</span><br />
                MOST.
              </h1>
              <p className="text-text-muted text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
                14 years. 12,400+ moves. 48 background checked crew members across 15 cities. From a studio apartment to a 4 bedroom home, we handle it all.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/quote" className="bg-primary hover:bg-primary-hover text-white font-heading text-lg tracking-wider uppercase px-8 py-4 rounded-sm transition-colors text-center animate-pulse-orange">
                  Get Free Quote
                </Link>
                <Link href="/services" className="border border-text-muted/50 hover:border-primary text-text-primary font-heading text-lg tracking-wider uppercase px-8 py-4 rounded-sm transition-colors text-center">
                  View Services
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: <Star size={16} className="fill-amber-400 text-amber-400" />, text: `${companyStats.customerRating} Rating` },
                  { icon: <Truck size={16} className="text-primary" />, text: `${companyStats.totalMoves} Moves` },
                  { icon: <Clock size={16} className="text-primary" />, text: `${companyStats.onTimeRate} On Time` },
                  { icon: <Shield size={16} className="text-primary" />, text: 'Fully Insured' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-text-muted text-sm">
                    {b.icon} <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 text-center">
              {Object.entries(companyStats).map(([key, val]) => {
                const labels: Record<string, string> = { totalMoves: 'Total Moves', yearsInBusiness: 'Years in Business', citiesCovered: 'Cities Served', customerRating: 'Customer Rating', crewMembers: 'Crew Members', onTimeRate: 'On Time Rate' };
                return (
                  <div key={key}>
                    <p className="font-heading text-2xl md:text-3xl text-white">{val}</p>
                    <p className="text-white/70 text-xs font-mono-custom uppercase tracking-wider mt-0.5">{labels[key]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SERVICES STRIP */}
        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-2">What We Do</p>
                <h2 className="font-heading text-4xl md:text-5xl text-text-primary">MOVING SERVICES</h2>
              </div>
              <Link href="/services" className="hidden md:flex items-center gap-2 text-primary text-sm font-body hover:gap-3 transition-all">View All <ArrowRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {services.map((s) => <ServiceCard key={s.id} service={s} />)}
            </div>
            <div className="mt-6 md:hidden text-center">
              <Link href="/services" className="text-primary text-sm flex items-center gap-1 justify-center">View All Services <ArrowRight size={14} /></Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section-pad bg-surface">
          <div className="container-custom">
            <div className="text-center mb-14">
              <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-2">Simple Process</p>
              <h2 className="font-heading text-4xl md:text-5xl text-text-primary">HOW IT WORKS</h2>
              <p className="text-text-muted mt-4 max-w-xl mx-auto">From first quote to final furniture placement, we guide you through every step of your move.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.num} className="relative">
                  <div className="relative z-10 flex flex-col items-start">
                    <span className="font-heading text-5xl text-primary/20 mb-3">{step.num}</span>
                    <h3 className="font-heading text-xl text-text-primary mb-2">{step.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COVERAGE MAP BANNER */}
        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="bg-surface border border-border rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-3">15 Cities. One Company.</p>
                  <h2 className="font-heading text-4xl md:text-5xl text-text-primary mb-4">WE MOVE ACROSS SOUTHERN ONTARIO</h2>
                  <p className="text-text-muted leading-relaxed mb-6">From Windsor in the west to Barrie in the north, Niagara Falls in the east to London in the south — our GPS-tracked fleet covers it all.</p>
                  <Link href="/cities" className="bg-primary hover:bg-primary-hover text-white font-heading tracking-wider uppercase px-6 py-3 rounded-sm transition-colors inline-block">
                    See All Coverage Areas
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {cities.map((city) => (
                    <Link key={city.id} href={`/cities/${city.slug}`} className="flex items-center gap-1.5 text-text-muted hover:text-primary text-sm transition-colors group">
                      <MapPin size={12} className="text-primary/50 group-hover:text-primary shrink-0" />
                      {city.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MEET THE CREW */}
        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-2">The People Behind the Moves</p>
                <h2 className="font-heading text-4xl md:text-5xl text-text-primary">MEET THE CREW</h2>
              </div>
              <Link href="/crew" className="hidden md:flex items-center gap-2 text-primary text-sm hover:gap-3 transition-all">Full Team <ArrowRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCrew.map((m) => <CrewCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="section-pad bg-surface">
          <div className="container-custom">
            <div className="text-center mb-14">
              <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-2">The MoveMaster Difference</p>
              <h2 className="font-heading text-4xl md:text-5xl text-text-primary">WHY CHOOSE US</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whyUs.map((w) => (
                <div key={w.title} className="bg-bg border border-border rounded-xl p-6 hover:border-primary/40 transition-colors">
                  <div className="w-12 h-12 bg-primary/15 rounded-xl flex items-center justify-center text-primary mb-4">
                    {w.icon}
                  </div>
                  <h3 className="font-heading text-xl text-text-primary mb-2">{w.title}</h3>
                  <p className="text-text-muted text-sm leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING TEASER */}
        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="text-center mb-14">
              <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-2">Transparent Pricing</p>
              <h2 className="font-heading text-4xl md:text-5xl text-text-primary">NO SURPRISES. EVER.</h2>
              <p className="text-text-muted mt-4 max-w-xl mx-auto">Every quote is a detailed breakdown. Every invoice matches. Every time.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {pricingTiers.map((tier) => (
                <div key={tier.id} className={`relative rounded-xl border p-6 flex flex-col ${tier.popular ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
                  {tier.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-mono-custom px-4 py-1 rounded-full">Most Popular</span>}
                  <h3 className="font-heading text-2xl text-text-primary mb-1">{tier.name}</h3>
                  <p className="text-text-muted text-sm mb-4">{tier.description}</p>
                  <p className="font-heading text-4xl text-primary mb-1">${tier.baseRate}<span className="text-text-muted text-lg font-body">/hr</span></p>
                  <p className="text-xs text-text-muted mb-6">Starting rate — final price based on home size & move details</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.slice(0,5).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                        <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/quote" className={`font-heading tracking-wider uppercase text-center py-3 rounded-sm transition-colors ${tier.popular ? 'bg-primary hover:bg-primary-hover text-white' : 'border border-primary text-primary hover:bg-primary hover:text-white'}`}>
                    Get Quote
                  </Link>
                </div>
              ))}
            </div>
            <p className="text-center text-text-muted text-sm">
              All pricing includes fuel surcharge and basic insurance. No hidden fees. <Link href="/pricing" className="text-primary hover:underline">View full pricing details</Link>
            </p>
          </div>
        </section>

        {/* BLOG PREVIEW */}
        <section className="section-pad bg-surface">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-2">Moving Tips & Guides</p>
                <h2 className="font-heading text-4xl md:text-5xl text-text-primary">FROM THE BLOG</h2>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary text-sm hover:gap-3 transition-all">All Posts <ArrowRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-bg border border-border rounded-xl overflow-hidden card-hover">
                  <div className="relative h-44 overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
                    <span className="absolute top-3 left-3 bg-primary/90 text-white text-xs px-2 py-0.5 rounded font-mono-custom capitalize">{post.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg text-text-primary group-hover:text-primary transition-colors mb-2">{post.title}</h3>
                    <p className="text-text-muted text-sm line-clamp-2 leading-relaxed mb-3">{post.excerpt}</p>
                    <p className="text-xs text-text-muted font-mono-custom">{post.readTime} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 border border-white/30 rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 border border-white/20 rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>
          <div className="container-custom relative z-10 text-center">
            <h2 className="font-heading text-5xl md:text-7xl text-white mb-4">READY TO MOVE?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Get your free, no-obligation quote in 5 minutes. A coordinator will call within 2 hours to confirm.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="bg-white text-primary hover:bg-gray-100 font-heading text-xl tracking-wider uppercase px-10 py-5 rounded-sm transition-colors">
                Get Free Quote
              </Link>
              <a href="tel:+18006683627" className="border-2 border-white text-white hover:bg-white/10 font-heading text-xl tracking-wider uppercase px-10 py-5 rounded-sm transition-colors flex items-center gap-2 justify-center">
                <Phone size={20} /> Call Now
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
