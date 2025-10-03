export const TRAVEL_THRESHOLD_KM = Number(process.env.TRAVEL_THRESHOLD_KM);

export const TRAVEL_RATE_CENTS_PER_KM = Number(
  process.env.TRAVEL_RATE_CENTS_PER_KM
);

export const TRAVEL_MIN_FEE_CENTS = Number(process.env.TRAVEL_MIN_FEE_CENTS);

export function computeTravelFeeCents(distanceKm: number): number {
  if (!Number.isFinite(distanceKm)) return 0;
  if (distanceKm < TRAVEL_THRESHOLD_KM) return 0;

  const billableKm = distanceKm - TRAVEL_THRESHOLD_KM;
  const variable = Math.ceil(billableKm) * TRAVEL_RATE_CENTS_PER_KM; // round up per km
  return Math.max(variable, TRAVEL_MIN_FEE_CENTS);
}
