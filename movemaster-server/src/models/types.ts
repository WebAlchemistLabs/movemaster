// ─── Shared Domain Types ─────────────────────────────────────────────────────

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

export type UserRole = 'customer' | 'admin' | 'crew';

// ─── Quote / Booking ─────────────────────────────────────────────────────────

export interface QuoteRequest {
  id: string;
  uid?: string;
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
  floorOrigin: number;
  floorDestination: number;
  hasElevator: boolean;
  estimatedHours?: number;
  estimatedPrice?: number;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedCrewId?: string;
  depositPaid: boolean;
  depositAmount?: number;
  stripePaymentIntentId?: string;
  hearAboutUs?: string;
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

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  preferredCity?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// ─── Stripe ───────────────────────────────────────────────────────────────────

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

// ─── API Response Wrappers ───────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    pages?: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationQuery {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
