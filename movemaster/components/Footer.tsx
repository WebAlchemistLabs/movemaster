import Link from 'next/link';
import { Truck, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const services = ['Residential Moving', 'Commercial Moving', 'Long-Distance Moving', 'Packing & Unpacking', 'Storage Solutions', 'Specialty Moving', 'Last-Minute Moving', 'Senior Moving'];
const cities = ['Toronto', 'Mississauga', 'Brampton', 'Hamilton', 'Burlington', 'Oakville', 'Kitchener', 'London', 'Barrie'];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <Truck size={16} className="text-white" />
              </div>
              <span className="font-heading text-lg text-text-primary">MOVEMASTER <span className="text-primary">PRO</span></span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Southern Ontario&apos;s most trusted moving company since 2010. Over 12,400 moves and counting.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"><Facebook size={14} /></a>
              <a href="#" className="w-8 h-8 rounded border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"><Instagram size={14} /></a>
              <a href="#" className="w-8 h-8 rounded border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors"><Linkedin size={14} /></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-text-primary tracking-wider mb-4">SERVICES</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <Link href="/services" className="text-text-muted hover:text-primary text-sm transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div>
            <h4 className="font-heading text-text-primary tracking-wider mb-4">CITIES WE SERVE</h4>
            <ul className="space-y-2">
              {cities.map((c) => (
                <li key={c}>
                  <Link href={`/cities/${c.toLowerCase().replace(' ', '-')}`} className="text-text-muted hover:text-primary text-sm transition-colors">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-text-primary tracking-wider mb-4">CONTACT</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <Phone size={14} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+14165550200" className="hover:text-primary transition-colors">1-800-MOVEMASTER</a>
                  <p className="text-xs">Mon–Sun 7am–9pm</p>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <Mail size={14} className="text-primary mt-0.5 shrink-0" />
                <a href="mailto:info@movemaster.pro" className="hover:text-primary transition-colors">info@movemaster.pro</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-text-muted">
                <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                <span>2240 Derry Road East<br />Mississauga, ON L5S 1B1</span>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs text-primary font-mono-custom font-medium">24/7 EMERGENCY LINE</p>
              <a href="tel:+14165550911" className="text-text-primary font-heading text-lg hover:text-primary transition-colors">1-800-SOS-MOVE</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} MoveMaster Pro Inc. All rights reserved. |{' '}
            <Link href="/about" className="hover:text-primary transition-colors">CVOR #1047832</Link> |{' '}
            WSIB Coverage Active | Fully Insured up to $2M
          </p>
          <div className="flex gap-4 text-xs text-text-muted">
            <Link href="/about" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/about" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
