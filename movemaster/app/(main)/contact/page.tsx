'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks';

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', serviceType: '', message: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success('Message sent! We will get back to you within 24 hours.');
    setForm({ name: '', email: '', phone: '', serviceType: '', message: '' });
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main className="bg-bg min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-primary font-mono text-xs tracking-widest uppercase mb-3">Get In Touch</p>
                <h1 className="font-heading text-5xl md:text-6xl text-white mb-4">LET&apos;S TALK<br />ABOUT YOUR MOVE</h1>
                <p className="text-text-muted text-lg leading-relaxed">
                  Have questions? Want a quick answer before filling out the full quote form? We are here. Call, email, or send us a message below.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <a href="tel:+18006683627" className="flex items-start gap-4 bg-bg border border-border rounded-xl p-5 hover:border-primary/40 transition-colors group">
                  <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-white font-heading text-xl group-hover:text-primary transition-colors">1-800-MOVE-PRO</p>
                    <p className="text-text-muted text-xs">Mon–Sat 7am–8pm | Sun 8am–6pm</p>
                  </div>
                </a>
                <a href="mailto:hello@movemasterpro.ca" className="flex items-start gap-4 bg-bg border border-border rounded-xl p-5 hover:border-primary/40 transition-colors group">
                  <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-white font-heading text-xl group-hover:text-primary transition-colors">hello@movemasterpro.ca</p>
                    <p className="text-text-muted text-xs">Response within 24 hours</p>
                  </div>
                </a>
                <div className="flex items-start gap-4 bg-bg border border-border rounded-xl p-5">
                  <div className="w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center text-primary shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-0.5">Office</p>
                    <p className="text-white text-sm">47 Industrial Pkwy N, Aurora, ON L4G 0R4</p>
                    <p className="text-text-muted text-xs">GTA operations hub — serving all of Southern Ontario</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Banner */}
        <div className="bg-primary/10 border-b border-primary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-primary shrink-0" />
              <p className="text-white text-sm">
                <span className="font-heading">Emergency / Same-Day Moving:</span>{' '}
                <span className="text-text-muted">Call our priority line — we dispatch within 2 hours when available.</span>
              </p>
            </div>
            <a href="tel:+14165550911" className="text-primary font-heading tracking-wider text-sm border border-primary px-4 py-2 rounded-sm hover:bg-primary hover:text-white transition-colors shrink-0">
              416-555-0911
            </a>
          </div>
        </div>

        {/* Contact Form + Info */}
        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="font-heading text-3xl text-white mb-6">SEND US A MESSAGE</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-dark">Full Name *</label>
                      <input required className="input-dark" placeholder="Jane Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="label-dark">Phone Number</label>
                      <input type="tel" className="input-dark" placeholder="416-555-0100" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="label-dark">Email Address *</label>
                    <input required type="email" className="input-dark" placeholder="jane@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="label-dark">What can we help with?</label>
                    <select className="input-dark" value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                      <option value="">Select service type...</option>
                      <option>Residential Moving</option>
                      <option>Commercial Moving</option>
                      <option>Long-Distance Moving</option>
                      <option>Packing & Unpacking</option>
                      <option>Storage Solutions</option>
                      <option>Specialty Item Moving</option>
                      <option>Last-Minute Moving</option>
                      <option>Senior Moving</option>
                      <option>General Question</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-dark">Message *</label>
                    <textarea
                      required
                      className="input-dark resize-none h-32"
                      placeholder="Tell us about your move — where, when, how big, any special requirements..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  <p className="text-text-muted text-xs text-center">
                    For quotes, use our <Link href="/quote" className="text-primary hover:underline">Quote Form</Link> for the fastest response.
                  </p>
                </form>
              </div>

              {/* Hours & Info */}
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-3xl text-white mb-6">HOURS OF OPERATION</h2>
                  <div className="bg-surface border border-border rounded-xl divide-y divide-border">
                    {[
                      { day: 'Monday – Friday', hours: '7:00 AM – 8:00 PM' },
                      { day: 'Saturday', hours: '7:00 AM – 6:00 PM' },
                      { day: 'Sunday', hours: '8:00 AM – 5:00 PM' },
                      { day: 'Statutory Holidays', hours: 'Limited — call to confirm' },
                    ].map(({ day, hours }) => (
                      <div key={day} className="flex justify-between px-5 py-3.5 text-sm">
                        <span className="text-text-muted">{day}</span>
                        <span className="text-white">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading text-2xl text-white mb-4">SERVICE AREAS</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Toronto', 'Mississauga', 'Brampton', 'Hamilton', 'Burlington', 'Oakville', 'Kitchener', 'Waterloo', 'Cambridge', 'Guelph', 'London', 'Windsor', 'Niagara Falls', 'St. Catharines', 'Barrie'].map((city) => (
                      <Link key={city} href={`/cities/${city.toLowerCase().replace(/ /g, '-')}`} className="bg-bg border border-border text-text-muted text-xs px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors">
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="relative h-48 rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1565992441121-4367b2138e1b?w=800&h=400&fit=crop"
                    alt="Southern Ontario map"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-bg/40 flex items-center justify-center">
                    <p className="text-white font-heading text-xl">SOUTHERN ONTARIO</p>
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
