/**
 * Money utilities for AllThingsMerch
 * Handles rounding and formatting currency in THB (฿)
 */

export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function formatTHB(amount: number): string {
  const rounded = roundMoney(amount);
  return `฿${rounded.toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}
