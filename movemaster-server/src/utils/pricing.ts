import type { QuoteInput, QuoteResult, MoveSize } from '../models/types';

const HOURLY_RATES: Record<MoveSize, number> = {
  studio: 129,
  '1-bedroom': 149,
  '2-bedroom': 169,
  '3-bedroom': 199,
  '4-bedroom': 249,
  'office-small': 189,
  'office-large': 229,
};

const ESTIMATED_HOURS: Record<MoveSize, number> = {
  studio: 2.5,
  '1-bedroom': 3.5,
  '2-bedroom': 5,
  '3-bedroom': 7,
  '4-bedroom': 9,
  'office-small': 6,
  'office-large': 10,
};

const GTA_CITIES = new Set(['Toronto', 'Mississauga', 'Brampton', 'Markham', 'Vaughan', 'Etobicoke']);
const FAR_CITIES = new Set(['Windsor', 'London', 'Niagara Falls', 'St. Catharines', 'Barrie']);

export function calculateQuote(input: QuoteInput): QuoteResult {
  const hourlyRate = HOURLY_RATES[input.moveSize] ?? 149;
  const estimatedHours = ESTIMATED_HOURS[input.moveSize] ?? 4;
  const basePrice = hourlyRate * estimatedHours;

  // Long-distance fee
  let longDistanceFee = 0;
  if (input.serviceType === 'long-distance' && input.originCity !== input.destinationCity) {
    const originFar = FAR_CITIES.has(input.originCity);
    const destFar = FAR_CITIES.has(input.destinationCity);
    const originGTA = GTA_CITIES.has(input.originCity);
    const destGTA = GTA_CITIES.has(input.destinationCity);

    if ((originFar || destFar) && !(originFar && destFar)) {
      longDistanceFee = 900;
    } else if (!originGTA || !destGTA) {
      longDistanceFee = 500;
    } else {
      longDistanceFee = 200;
    }
  }

  // Add-ons
  const packingFee = input.needsPacking ? Math.round(basePrice * 0.3) : 0;
  const storageFee = input.needsStorage ? 149 : 0;
  const specialtyFee = input.hasSpecialtyItems ? 250 : 0;

  // Floor fees (no elevator, above 2nd floor)
  let floorFee = 0;
  if (!input.hasElevator) {
    const originAbove = Math.max(0, (input.floorOrigin ?? 1) - 2);
    const destAbove = Math.max(0, (input.floorDestination ?? 1) - 2);
    floorFee = (originAbove + destAbove) * 50;
  }

  // Last-minute premium
  const lastMinutePremium =
    input.serviceType === 'last-minute' ? Math.round(basePrice * 0.25) : 0;

  const subtotal =
    basePrice + longDistanceFee + packingFee + storageFee + specialtyFee + floorFee + lastMinutePremium;

  const totalMin = Math.round(subtotal * 0.85);
  const totalMax = Math.round(subtotal * 1.15);
  const depositAmount = Math.round(subtotal * 0.2);

  return {
    estimatedHours,
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
