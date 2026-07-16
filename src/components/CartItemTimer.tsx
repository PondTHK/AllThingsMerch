'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { useReservationTimer } from '@/lib/cart/useReservationTimer';
import { useHydrated } from '@/lib/cart/useHydrated';

interface CartItemTimerProps {
  reservedUntil: string | undefined;
  /** True for the item whose reservation expires soonest — gets highlighted. */
  isSoonest: boolean;
}

/**
 * Compact timer badge shown under each cart item row.
 *
 * Visibility rules:
 *  - Hidden on SSR / before hydration (avoids mismatch)
 *  - Hidden when no reservedUntil (old persisted carts, or non-expiring items)
 *  - Hidden when already expired (page will handle that via releaseExpiredReservation)
 *  - Non-soonest items: only show if < 5 min (don't clutter UI for items with plenty of time)
 *  - Soonest item: always show so user knows exactly when the earliest lock expires
 */
export function CartItemTimer({ reservedUntil, isSoonest }: CartItemTimerProps) {
  const isHydrated = useHydrated();
  const { formattedTime, isExpired, isUrgent, isWarning, hasTimer } =
    useReservationTimer(reservedUntil);

  if (!isHydrated || !hasTimer || isExpired) return null;
  // For non-soonest items only show if entering warning window
  if (!isSoonest && !isWarning) return null;

  return (
    <div
      className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono transition-colors ${
        isUrgent && isSoonest
          ? 'bg-red-100 text-red-700 animate-pulse'
          : isWarning && isSoonest
            ? 'bg-amber-100 text-amber-700'
            : isWarning
              ? 'bg-neutral-100 text-neutral-500'
              : 'bg-neutral-100 text-neutral-400'
      }`}
    >
      <Clock className="w-3 h-3 shrink-0" />
      <span>
        {isSoonest && isUrgent
          ? `Expires in ${formattedTime}!`
          : `Reserved ${formattedTime}`}
      </span>
    </div>
  );
}
