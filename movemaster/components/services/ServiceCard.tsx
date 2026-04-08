import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Home, Building2, Truck, Package, Warehouse, Star, Zap, Heart } from 'lucide-react';
import type { ServicePackage } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

const icons: Record<string, React.ReactNode> = {
  Home: <Home size={20} />, Building2: <Building2 size={20} />, Truck: <Truck size={20} />,
  Package: <Package size={20} />, Warehouse: <Warehouse size={20} />, Star: <Star size={20} />,
  Zap: <Zap size={20} />, Heart: <Heart size={20} />,
};

const priceUnitLabel: Record<string, string> = { hour: '/hr', flat: ' flat', 'per-room': '/room' };

export default function ServiceCard({ service, compact }: { service: ServicePackage; compact?: boolean }) {
  return (
    <Link href={`/services/${service.slug}`} className="group block bg-surface border border-border rounded-xl overflow-hidden card-hover">
      {!compact && (
        <div className="relative h-44 overflow-hidden">
          <Image src={service.image} alt={service.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
          {service.popular && (
            <span className="absolute top-3 right-3 bg-primary text-white text-xs font-mono-custom px-2.5 py-1 rounded-full">Popular</span>
          )}
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-primary/15 rounded-lg flex items-center justify-center text-primary">
            {icons[service.icon]}
          </div>
          <div>
            <p className="font-heading text-lg text-text-primary tracking-wide">{service.name}</p>
            <p className="text-primary text-sm font-mono-custom">From {formatCurrency(service.basePrice)}{priceUnitLabel[service.priceUnit]}</p>
          </div>
        </div>
        <p className={cn('text-text-muted text-sm leading-relaxed', !compact && 'line-clamp-2')}>{service.description}</p>
        <div className="flex items-center gap-1 mt-3 text-primary text-sm font-body font-medium group-hover:gap-2 transition-all">
          Learn More <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}
