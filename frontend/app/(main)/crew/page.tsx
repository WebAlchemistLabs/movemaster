import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CrewCard from '@/components/crew/CrewCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { crew } from '@/data';

export const metadata: Metadata = {
  title: 'Meet the Crew',
  description: '48 background-checked, certified moving professionals serving Southern Ontario. Meet the team behind MoveMaster Pro.',
};

export default function CrewPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <div className="bg-surface py-16 border-b border-border">
          <div className="container-custom">
            <SectionHeader eyebrow="The People Behind the Moves" title="MEET THE CREW" subtitle="48 background-checked, AMSA-certified professionals who treat your belongings like their own. Every crew member has been personally vetted, trained, and takes pride in their work." />
          </div>
        </div>
        <section className="section-pad bg-bg">
          <div className="container-custom">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {crew.map((m) => <CrewCard key={m.id} member={m} />)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
