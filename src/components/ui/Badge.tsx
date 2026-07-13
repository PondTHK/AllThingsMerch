import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'neutral';
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-white/10 text-white border-white/20',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    neutral: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border uppercase',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
