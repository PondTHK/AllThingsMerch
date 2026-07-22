'use client';

import React from 'react';
import { Check, Clock, PackageCheck, Truck, CheckCircle2, XCircle } from 'lucide-react';

interface OrderStatusTimelineProps {
  status: string;
  createdAt?: string;
}

export function OrderStatusTimeline({ status, createdAt }: OrderStatusTimelineProps) {
  const normalized = (status || '').toLowerCase().trim();

  if (normalized === 'cancelled' || normalized === 'canceled') {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-center gap-4 text-rose-800 dark:text-rose-300">
        <XCircle className="w-8 h-8 shrink-0" />
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider">Order Cancelled</h4>
          <p className="text-xs mt-0.5 opacity-90">
            This order has been cancelled and stopped from further processing or shipment. If you have questions, please contact official support.
          </p>
        </div>
      </div>
    );
  }

  // Determine active step index (0 to 3)
  let currentStepIndex = 0;
  if (normalized === 'paid') {
    currentStepIndex = 0;
  } else if (normalized === 'processing') {
    currentStepIndex = 1;
  } else if (normalized === 'shipped') {
    currentStepIndex = 2;
  } else if (normalized === 'delivered' || normalized === 'fulfilled' || normalized === 'completed') {
    currentStepIndex = 3;
  } else if (normalized === 'pending_payment' || normalized === 'pending') {
    currentStepIndex = -1; // Not yet paid
  }

  const steps = [
    {
      label: 'Order Confirmed',
      sublabel: createdAt ? new Date(createdAt).toLocaleDateString() : 'Paid',
      icon: Clock,
    },
    {
      label: 'Processing & Packing',
      sublabel: 'Preparing items & TAGs',
      icon: PackageCheck,
    },
    {
      label: 'Shipped & In Transit',
      sublabel: 'Courier dispatched',
      icon: Truck,
    },
    {
      label: 'Delivered',
      sublabel: 'Verified & received',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-6 transition-colors">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
            Fulfillment Progress Tracker
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Real-time status updates from our central distribution &amp; licensing warehouse.
          </p>
        </div>
        {currentStepIndex === -1 && (
          <span className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            Awaiting Payment
          </span>
        )}
      </div>

      <div className="relative pt-2 pb-4">
        {/* Horizontal bar line */}
        <div className="hidden sm:block absolute top-6 left-12 right-12 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full z-0">
          <div
            className="h-full bg-foreground transition-all duration-500 rounded-full"
            style={{
              width:
                currentStepIndex <= 0
                  ? '0%'
                  : currentStepIndex === 1
                  ? '33%'
                  : currentStepIndex === 2
                  ? '66%'
                  : '100%',
            }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-4 relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex > idx || (currentStepIndex === 3 && idx === 3);
            const isCurrent = currentStepIndex === idx;
            const StepIcon = step.icon;

            return (
              <div key={step.label} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3">
                {/* Circle indicator */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 shrink-0 ${
                    isCompleted
                      ? 'bg-foreground text-background border-foreground shadow-sm'
                      : isCurrent
                      ? 'bg-primary text-primary-foreground border-primary ring-4 ring-primary/20 scale-110'
                      : 'bg-surface text-muted border-border'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3]" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>

                {/* Text details */}
                <div className="flex-1 sm:flex-none">
                  <div
                    className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                      isCompleted || isCurrent ? 'text-foreground' : 'text-muted'
                    }`}
                  >
                    {step.label}
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">
                    {step.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
