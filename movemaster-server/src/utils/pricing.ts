import type { QuoteInput } from '../models/types';

const RATES: Record<string, number> = {
  studio: 129, '1-bedroom': 149, '2-bedroom': 169,
  '3-bedroom': 199, '4-bedroom': 249, 'office-small': 189, 'office-large': 229,
};
const HOURS: Record<string, number> = {
  studio: 2.5, '1-bedroom': 3.5, '2-bedroom': 5,
  '3-bedroom': 7, '4-bedroom': 9, 'office-small': 6, 'office-large': 10,
};
const GTA = new Set(['Toronto','Mississauga','Brampton','Markham','Vaughan']);
const FAR = new Set(['Windsor','London','Niagara Falls','St. Catharines','Barrie']);

export function calculateQuote(input: QuoteInput) {
  const rate  = RATES[input.moveSize] ?? 149;
  const hours = HOURS[input.moveSize] ?? 4;
  const base  = rate * hours;

  let longDistance = 0;
  if (input.serviceType === 'long-distance' && input.originCity !== input.destinationCity) {
    const oFar = FAR.has(input.originCity);   const dFar = FAR.has(input.destinationCity);
    const oGTA = GTA.has(input.originCity);   const dGTA = GTA.has(input.destinationCity);
    longDistance = (oFar || dFar) && !(oFar && dFar) ? 900 : (!oGTA || !dGTA) ? 500 : 200;
  }

  const packing   = input.needsPacking      ? Math.round(base * 0.3) : 0;
  const storage   = input.needsStorage      ? 149 : 0;
  const specialty = input.hasSpecialtyItems ? 250 : 0;
  const lastMin   = input.serviceType === 'last-minute' ? Math.round(base * 0.25) : 0;

  let floors = 0;
  if (!input.hasElevator) {
    floors = (Math.max(0, input.floorOrigin - 2) + Math.max(0, input.floorDestination - 2)) * 50;
  }

  const sub    = base + longDistance + packing + storage + specialty + lastMin + floors;
  const depAmt = Math.round(sub * 0.2);

  return {
    estimatedHours: hours, hourlyRate: rate, basePrice: base,
    packingFee: packing, storageFee: storage, specialtyFee: specialty,
    floorFee: floors, longDistanceFee: longDistance,
    totalMin: Math.round(sub * 0.85), totalMax: Math.round(sub * 1.15),
    depositAmount: depAmt,
  };
}
