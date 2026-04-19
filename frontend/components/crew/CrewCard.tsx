import Link from 'next/link';
import Image from 'next/image';
import RatingStars from '@/components/ui/RatingStars';
import type { MovingCrew } from '@/types';

const roleLabels: Record<string, string> = { 'lead-mover': 'Lead Mover', packer: 'Packing Specialist', driver: 'Senior Driver', coordinator: 'Move Coordinator' };

export default function CrewCard({ member }: { member: MovingCrew }) {
  return (
    <Link href={`/crew/${member.id}`} className="group block bg-surface border border-border rounded-xl overflow-hidden card-hover">
      <div className="relative h-52 overflow-hidden">
        <Image src={member.photo} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
        {member.featured && (
          <span className="absolute top-3 left-3 bg-primary text-white text-xs font-mono-custom px-2.5 py-1 rounded-full">Featured</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-xl text-text-primary">{member.name}</h3>
        <p className="text-primary text-xs font-mono-custom mb-2">{roleLabels[member.role]}</p>
        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={member.rating} size={12} />
          <span className="text-text-muted text-xs">{member.rating} ({member.reviewCount} reviews)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {member.cities.slice(0,3).map((c) => (
            <span key={c} className="text-xs bg-white/5 text-text-muted px-2 py-0.5 rounded">{c}</span>
          ))}
        </div>
        <div className="mt-3 flex justify-between items-center text-xs text-text-muted border-t border-border pt-3">
          <span>{member.yearsExperience} yrs exp</span>
          {member.totalMoves > 0 && <span>{member.totalMoves.toLocaleString()} moves</span>}
        </div>
      </div>
    </Link>
  );
}
