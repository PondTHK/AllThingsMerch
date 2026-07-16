'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { useReservationTimer } from '@/lib/cart/useReservationTimer';
import { useHydrated } from '@/lib/cart/useHydrated';

interface CheckoutReservationBannerProps {
  /** ISO timestamp of the soonest-expiring item in the cart. Null = no timers. */
  soonestExpiry: string | null;
}

/**
 * Sticky timer banner for the checkout page + urgency modal.
 *
 * Behaviour:
 *  - Renders nothing on SSR / before hydration.
 *  - Shows a subtle neutral banner while plenty of time remains (>= 5 min).
 *  - Turns amber when < 5 min remaining.
 *  - Turns red + pulses when < 1 min remaining.
 *  - At < 1 min: auto-shows a blocking modal. Dismissed once per urgency window
 *    so it doesn't keep re-appearing if the user clicks "Continue".
 *
 * Real-DB compatibility:
 *  The soonestExpiry is derived from CartItem.reservedUntil, which is always
 *  the client-side ISO string managed by useCartStore. No DB call needed here.
 *  Server-side expiry is enforced separately in validateAndRecalculateCart /
 *  your future Server Action.
 */
export function CheckoutReservationBanner({
  soonestExpiry,
}: CheckoutReservationBannerProps) {
  const isHydrated = useHydrated();
  const { formattedTime, isExpired, isUrgent, isWarning, hasTimer } =
    useReservationTimer(soonestExpiry);

  const [showModal, setShowModal] = useState(false);
  // Prevent modal from re-opening in the same urgent window after dismissal
  const [modalDismissedAt, setModalDismissedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!isUrgent) return;
    // Show modal if not already dismissed in this urgency window
    const alreadyDismissed =
      modalDismissedAt !== null && Date.now() - modalDismissedAt < 90_000;
    if (!alreadyDismissed && !showModal) {
      const timer = setTimeout(() => setShowModal(true), 0);
      return () => clearTimeout(timer);
    }
  }, [isUrgent, showModal, modalDismissedAt]);

  if (!isHydrated || !hasTimer) return null;

  const bannerBg = isUrgent
    ? 'bg-red-600 text-white border-red-700'
    : isWarning
      ? 'bg-amber-50 text-amber-900 border-amber-300'
      : 'bg-neutral-100 text-neutral-600 border-neutral-200';

  return (
    <>
      {/* ── Sticky timer banner ─────────────────────────────────────────── */}
      <div
        className={`sticky top-0 z-40 flex items-center justify-between gap-4 px-4 py-2.5 border-b text-xs font-bold transition-colors ${bannerBg} ${isUrgent ? 'animate-pulse' : ''}`}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 shrink-0" />
          <span className="uppercase tracking-wider">Cart Reserved</span>
        </div>

        <span className="font-mono text-sm font-black tabular-nums">
          {isExpired ? 'EXPIRED' : formattedTime}
        </span>

        {isWarning && !isUrgent && (
          <span className="hidden sm:block text-[10px] uppercase tracking-wider opacity-70">
            Complete your order before time runs out
          </span>
        )}
        {isUrgent && (
          <span className="text-[10px] uppercase tracking-wider font-black">
            Confirm now!
          </span>
        )}
      </div>

      {/* ── Urgency modal ───────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center space-y-5 border border-neutral-200 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-100 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-black text-black uppercase tracking-wider">
                Reservation Expiring Soon
              </h2>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                Your cart reservation expires in{' '}
                <span className="font-black text-red-600 font-mono">
                  {formattedTime}
                </span>
                . If time runs out your items will be released back to stock.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setModalDismissedAt(Date.now());
              }}
              className="w-full py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Continue Checkout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
