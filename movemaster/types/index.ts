export type ServiceType =
  | 'residential'
  | 'commercial'
  | 'long-distance'
  | 'packing'
  | 'storage'
  | 'specialty'
  | 'last-minute'
  | 'senior';

export type MoveSize =
  | 'studio'
  | '1-bedroom'
  | '2-bedroom'
  | '3-bedroom'
  | '4-bedroom'
  | 'office-small'
  | 'office-large';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled';

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  moveDate: string;
  moveSize: MoveSize;
  serviceType: ServiceType;
  originAddress: string;
  originCity: string;
  destinationAddress: string;
  destinationCity: string;
  needsPacking: boolean;
  needsStorage: boolean;
  hasSpecialtyItems: boolean;
  specialtyDetails?: string;
  floorOrigin?: number;
  floorDestination?: number;
  hasElevator: boolean;
  estimatedHours?: number;
  estimatedPrice?: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  assignedCrewId?: string;
  depositPaid: boolean;
  depositAmount?: number;
}

export interface MovingCrew {
  id: string;
  name: string;
  photo: string;
  role: 'lead-mover' | 'packer' | 'driver' | 'coordinator';
  bio: string;
  yearsExperience: number;
  specialties: string[];
  cities: string[];
  rating: number;
  reviewCount: number;
  totalMoves: number;
  featured: boolean;
  certifications: string[];
}

export interface ServicePackage {
  id: string;
  name: string;
  slug: string;
  serviceType: ServiceType;
  description: string;
  longDescription: string;
  basePrice: number;
  priceUnit: 'hour' | 'flat' | 'per-room';
  minHours?: number;
  includes: string[];
  addOns: string[];
  image: string;
  popular: boolean;
  icon: string;
}

export interface Review {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  title: string;
  text: string;
  serviceType: ServiceType;
  moveSize: MoveSize;
  originCity: string;
  destinationCity: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export interface CoverageCity {
  id: string;
  name: string;
  slug: string;
  region: string;
  image: string;
  description: string;
  moveCount: number;
  averageRating: number;
  popular: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyMoves?: number;
  baseRate: number;
  features: string[];
  popular: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'tips' | 'guides' | 'news' | 'local';
  image: string;
  author: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'pricing' | 'booking' | 'moving-day' | 'packing' | 'storage';
}

export interface CompanyStats {
  totalMoves: string;
  yearsInBusiness: string;
  citiesCovered: string;
  customerRating: string;
  crewMembers: string;
  onTimeRate: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  preferredCity?: string;
  createdAt: string;
}

export interface QuoteInput {
  serviceType: ServiceType;
  moveSize: MoveSize;
  originCity: string;
  destinationCity: string;
  needsPacking: boolean;
  needsStorage: boolean;
  hasSpecialtyItems: boolean;
  floorOrigin: number;
  floorDestination: number;
  hasElevator: boolean;
}

export interface QuoteResult {
  estimatedHours: number;
  hourlyRate: number;
  basePrice: number;
  packingFee: number;
  storageFee: number;
  specialtyFee: number;
  floorFee: number;
  longDistanceFee: number;
  totalMin: number;
  totalMax: number;
  depositAmount: number;
}
