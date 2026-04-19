import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, MapPin, Award, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RatingStars from '@/components/ui/RatingStars';
import { crew } from '@/data';

export async function generateStaticParams() {
  return crew.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const member = crew.find((m) => m.id === params.id);
  if (!member) return {};
  return { title: member.name, description: member.bio.substring(0, 160) };
}

const roleLabels: Record<string, string> = { 'lead-mover': 'Lead Mover', packer: 'Packing Specialist', driver: 'Senior Driver', coordinator: 'Move Coordinator' };

export default function CrewProfilePage({ params }: { params: { id: string } }) {
  const member = crew.find((m) => m.id === params.id);
  if (!member) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="bg-surface border-b border-border">
          <div className="container-custom py-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden shrink-0">
                <Image src={member.photo} alt={member.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-primary font-mono-custom text-sm tracking-widest uppercase mb-1">{roleLabels[member.role]}</p>
                <h1 className="font-heading text-4xl md:text-5xl text-text-primary mb-3">{member.name}</h1>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <RatingStars rating={member.rating} size={16} />
                    <span className="text-text-muted text-sm">{member.rating} ({member.reviewCount} reviews)</span>
                  </div>
                  <span className="text-text-muted text-sm">{member.yearsExperience} years experience</span>
                  {member.totalMoves > 0 && <span className="text-text-muted text-sm">{member.totalMoves.toLocaleString()} moves completed</span>}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {member.certifications.map((c) => (
                    <span key={c} className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full">
                      <Award size={11} /> {c}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {member.cities.map((c) => (
                    <span key={c} className="flex items-center gap-1 text-xs text-text-muted bg-surface border border-border px-2.5 py-1 rounded-full">
                      <MapPin size={10} className="text-primary" /> {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-4">ABOUT {member.name.split(' ')[0].toUpperCase()}</h2>
                  <p className="text-text-muted leading-relaxed text-lg">{member.bio}</p>
                </div>
                <div>
                  <h2 className="font-heading text-3xl text-text-primary mb-4">SPECIALTIES</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {member.specialties.map((s) => (
                      <div key={s} className="flex items-center gap-2 text-text-muted text-sm">
                        <CheckCircle size={14} className="text-primary" /> {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-surface border border-border rounded-xl p-6">
                  <h3 className="font-heading text-xl text-text-primary mb-4">REQUEST {member.name.split(' ')[0].toUpperCase()}&apos;S CREW</h3>
                  <p className="text-text-muted text-sm mb-5">Mention {member.name.split(' ')[0]} in your quote notes and we will do our best to assign them to your move.</p>
                  <Link href={`/quote?crew=${member.id}`} className="block bg-primary hover:bg-primary-hover text-white font-heading tracking-wider uppercase text-center py-4 rounded-sm transition-colors w-full">
                    Get Quote
                  </Link>
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
