'use client';

import React from 'react';
import { Clock, CreditCard, PackageCheck, Truck, CheckCircle2, XCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export function OrderStatusBadge({ status, size = 'sm' }: OrderStatusBadgeProps) {
  const normalizedStatus = (status || '').toLowerCase().trim();

  let label = status;
  let bgClass = 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700';
  let Icon = Clock;

  switch (normalizedStatus) {
    case 'pending_payment':
    case 'pending':
      label = 'Pending Payment (รอชำระเงิน)';
      bgClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      Icon = Clock;
      break;
    case 'paid':
      label = 'Paid (ชำระเงินแล้ว)';
      bgClass = 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
      Icon = CreditCard;
      break;
    case 'processing':
      label = 'Processing (กำลังเตรียมจัดส่ง)';
      bgClass = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
      Icon = PackageCheck;
      break;
    case 'shipped':
      label = 'Shipped (จัดส่งแล้ว)';
      bgClass = 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60';
      Icon = Truck;
      break;
    case 'delivered':
    case 'fulfilled':
    case 'completed':
      label = 'Delivered (ได้รับสินค้าเรียบร้อย)';
      bgClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      Icon = CheckCircle2;
      break;
    case 'cancelled':
    case 'canceled':
      label = 'Cancelled (ยกเลิกคำสั่งซื้อ)';
      bgClass = 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
      Icon = XCircle;
      break;
    default:
      label = status || 'Unknown Status';
      break;
  }

  const padding = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]';
  const iconSize = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full border transition-colors ${padding} ${bgClass}`}
    >
      <Icon className={`${iconSize} shrink-0`} />
      <span>{label}</span>
    </span>
  );
}
