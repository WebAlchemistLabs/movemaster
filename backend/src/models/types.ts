export type ServiceType = 'residential'|'commercial'|'long-distance'|'packing'|'storage'|'specialty'|'last-minute'|'senior';
export type MoveSize = 'studio'|'1-bedroom'|'2-bedroom'|'3-bedroom'|'4-bedroom'|'office-small'|'office-large';
export type BookingStatus = 'pending'|'confirmed'|'in-progress'|'completed'|'cancelled';
export type UserRole = 'customer'|'admin'|'crew';

export interface User {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  preferredCity?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Client {
  id: string;
  uid?: string;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  totalMoves: number;
  totalSpent: number;
  firstMoveDate?: string;
  lastMoveDate?: string;
  referralSource?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  clientId?: string;
  uid?: string;
  name: string;
  email: string;
  phone: string;
  moveDate?: string;
  moveSize: MoveSize;
  serviceType: ServiceType;
  originAddress?: string;
  originCity: string;
  destinationAddress?: string;
  destinationCity: string;
  needsPacking: boolean;
  needsStorage: boolean;
  hasSpecialtyItems: boolean;
  specialtyDetails?: string;
  floorOrigin: number;
  floorDestination: number;
  hasElevator: boolean;
  estimatedHours?: number;
  hourlyRate?: number;
  estimatedPrice?: number;
  finalPrice?: number;
  status: BookingStatus;
  assignedCrew?: string;
  notes?: string;
  hearAboutUs?: string;
  depositPaid: boolean;
  depositAmount?: number;
  depositPaidAt?: string;
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  jobId: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceType: string;
  moveDate?: string;
  route: string;
  subtotal: number;
  depositPaid: number;
  balanceDue: number;
  status: 'unpaid'|'partial'|'paid';
  issuedAt: string;
  dueAt?: string;
  paidAt?: string;
  lineItems: LineItem[];
  notes?: string;
  createdAt: string;
}

export interface LineItem {
  description: string;
  hours?: number;
  rate?: number;
  amount: number;
}

export interface Transaction {
  id: string;
  jobId?: string;
  invoiceId?: string;
  clientId?: string;
  type: 'deposit'|'balance'|'refund'|'other';
  amount: number;
  method: string;
  description: string;
  status: 'completed'|'pending'|'failed';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
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
