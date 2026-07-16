'use client';

import { useState, useEffect } from 'react';

export interface ReservationTimerState {
  secondsLeft: number;
  isExpired: boolean;
  /** < 60 seconds — trigger modal on checkout */
  isUrgent: boolean;
  /** < 5 minutes — show amber warning color */
  isWarning: boolean;
  /** "MM:SS" */
  formattedTime: string;
  /** false when reservedUntil is undefined/null — hide timer gracefully */
  hasTimer: boolean;
}

/**
 * Countdown hook for a single cart-item reservation timestamp.
 * Works in both Mock and Supabase mode — the timer source is always the
 * ISO string stored on CartItem.reservedUntil (client-side Zustand state).
 * Server-side expiry is validated separately in validateAndRecalculateCart.
 */
export function useReservationTimer(
  reservedUntil: string | undefined | null,
): ReservationTimerState {
  const calcSecondsLeft = () => {
    if (!reservedUntil) return 0;
    return Math.max(
      0,
      Math.floor((new Date(reservedUntil).getTime() - Date.now()) / 1000),
    );
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calcSecondsLeft);

  useEffect(() => {
    if (!reservedUntil) {
      setTimeout(() => setSecondsLeft(0), 0);
      return;
    }
    const tick = () => setSecondsLeft(calcSecondsLeft());
    tick(); // sync immediately after mount
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservedUntil]);

  const hasTimer = !!reservedUntil;
  const isExpired = hasTimer && secondsLeft === 0;
  const isUrgent = hasTimer && secondsLeft > 0 && secondsLeft < 60;
  const isWarning = hasTimer && secondsLeft > 0 && secondsLeft < 300;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return { secondsLeft, isExpired, isUrgent, isWarning, formattedTime, hasTimer };
}
