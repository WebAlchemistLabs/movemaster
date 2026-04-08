import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { QuoteInput, QuoteResult } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const hourlyRates: Record<string, number> = {
    studio: 129,
    '1-bedroom': 149,
    '2-bedroom': 169,
    '3-bedroom': 199,
    '4-bedroom': 249,
    'office-small': 189,
    'office-large': 229,
  };

  const estimatedHours: Record<string, number> = {
    studio: 2.5,
    '1-bedroom': 3.5,
    '2-bedroom': 5,
    '3-bedroom': 7,
    '4-bedroom': 9,
    'office-small': 6,
    'office-large': 10,
  };

  const hourlyRate = hourlyRates[input.moveSize] ?? 149;
  const hours = estimatedHours[input.moveSize] ?? 4;
  const basePrice = hourlyRate * hours;

  // Long-distance fee
  let longDistanceFee = 0;
  if (input.serviceType === 'long-distance') {
    const sameCity = input.originCity === input.destinationCity;
    if (!sameCity) {
      // Estimate distance based on city pairs
      const gtaCities = ['Toronto', 'Mississauga', 'Brampton'];
      const isOriginGTA = gtaCities.includes(input.originCity);
      const isDestGTA = gtaCities.includes(input.destinationCity);
      const farCities = ['Windsor', 'London', 'Niagara Falls', 'St. Catharines'];
      const isOriginFar = farCities.includes(input.originCity);
      const isDestFar = farCities.includes(input.destinationCity);

      if ((isOriginFar || isDestFar) && !(isOriginFar && isDestFar)) {
        longDistanceFee = 900;
      } else if (!isOriginGTA || !isDestGTA) {
        longDistanceFee = 500;
      } else {
        longDistanceFee = 200;
      }
    }
  }

  // Packing adds 30%
  const packingFee = input.needsPacking ? Math.round(basePrice * 0.3) : 0;

  // Storage flat fee
  const storageFee = input.needsStorage ? 149 : 0;

  // Specialty items
  const specialtyFee = input.hasSpecialtyItems ? 250 : 0;

  // Floor fees (no elevator, above 2nd floor)
  let floorFee = 0;
  if (!input.hasElevator) {
    const originFloorAbove2 = Math.max(0, input.floorOrigin - 2);
    const destFloorAbove2 = Math.max(0, input.floorDestination - 2);
    floorFee = (originFloorAbove2 + destFloorAbove2) * 50;
  }

  // Last-minute premium
  const lastMinutePremium = input.serviceType === 'last-minute' ? Math.round(basePrice * 0.25) : 0;

  const subtotal = basePrice + longDistanceFee + packingFee + storageFee + specialtyFee + floorFee + lastMinutePremium;
  const totalMin = Math.round(subtotal * 0.85);
  const totalMax = Math.round(subtotal * 1.15);
  const depositAmount = Math.round(subtotal * 0.2);

  return {
    estimatedHours: hours,
    hourlyRate,
    basePrice,
    packingFee,
    storageFee,
    specialtyFee,
    floorFee,
    longDistanceFee,
    totalMin,
    totalMax,
    depositAmount,
  };
}
