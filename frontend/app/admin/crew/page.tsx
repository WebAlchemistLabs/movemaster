import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, MapPin, Award, Star } from 'lucide-react';
import { crew } from '@/data';
import Navbar from '@/components/Navbar';

const roleLabels: Record<string, string> = {
  'lead-mover': 'Lead Mover',
  packer: 'Packing Specialist',
  driver: 'Senior Driver',
  coordinator: 'Move Coordinator',
};

const roleColors: Record<string, string> = {
  'lead-mover': 'bg-orange-900/40 text-orange-400 border-orange-800',
  packer: 'bg-blue-900/40 text-blue-400 border-blue-800',
  driver: 'bg-green-900/40 text-green-400 border-green-800',
  coordinator: 'bg-purple-900/40 text-purple-400 border-purple-800',
};

export default function AdminCrewPage() {
  const byRole = {
    coordinator: crew.filter((m) => m.role === 'coordinator'),
    'lead-mover': crew.filter((m) => m.role === 'lead-mover'),
    driver: crew.filter((m) => m.role === 'driver'),
    packer: crew.filter((m) => m.role === 'packer'),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/admin" className="text-text-muted hover:text-primary transition-colors"><ArrowLeft size={20} /></Link>
            <div>
              <h1 className="font-heading text-3xl text-white">CREW MANAGEMENT</h1>
              <p className="text-text-muted text-sm">{crew.length} crew members across Southern Ontario</p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {Object.entries(byRole).map(([role, members]) => (
              <div key={role} className="bg-surface border border-border rounded-xl p-4">
                <span className={`text-xs font-mono border px-2 py-0.5 rounded-full ${roleColors[role]}`}>
                  {roleLabels[role]}
                </span>
                <p className="font-heading text-3xl text-white mt-2">{members.length}</p>
                <p className="text-text-muted text-xs">Active members</p>
              </div>
            ))}
          </div>

          {/* Crew table */}
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-bg">
                  <tr>
                    {['Crew Member', 'Role', 'Experience', 'Rating', 'Cities', 'Moves', 'Certifications', 'Profile'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-text-muted text-xs font-mono uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {crew.map((member) => (
                    <tr key={member.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                            <Image src={member.photo} alt={member.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-white text-sm font-body whitespace-nowrap">{member.name}</p>
                            {member.featured && <span className="text-primary text-xs font-mono">Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-mono border px-2 py-0.5 rounded-full whitespace-nowrap ${roleColors[member.role]}`}>
                          {roleLabels[member.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-sm whitespace-nowrap">{member.yearsExperience} yrs</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="text-white text-sm">{member.rating}</span>
                          <span className="text-text-muted text-xs">({member.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[160px]">
                          {member.cities.slice(0, 3).map((c) => (
                            <span key={c} className="flex items-center gap-0.5 text-xs text-text-muted bg-bg border border-border px-1.5 py-0.5 rounded whitespace-nowrap">
                              <MapPin size={9} className="text-primary" />{c}
                            </span>
                          ))}
                          {member.cities.length > 3 && <span className="text-xs text-text-muted">+{member.cities.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-white text-sm whitespace-nowrap">
                        {member.totalMoves > 0 ? member.totalMoves.toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {member.certifications.slice(0, 2).map((c) => (
                            <span key={c} className="flex items-center gap-0.5 text-xs text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded whitespace-nowrap">
                              <Award size={9} />{c}
                            </span>
                          ))}
                          {member.certifications.length > 2 && <span className="text-xs text-text-muted">+{member.certifications.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/crew/${member.id}`} className="text-primary text-xs hover:underline whitespace-nowrap">
                          View Profile →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
