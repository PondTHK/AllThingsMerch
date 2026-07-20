/**
 * OrderStatus Value Object
 *
 * Encapsulates valid order lifecycle states and their transition rules.
 * Pure TypeScript — no framework dependency.
 */

export const ORDER_STATUSES = [
  'pending_payment',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;

export type OrderStatusValue = (typeof ORDER_STATUSES)[number];

/** Allowed forward transitions per status */
const ALLOWED_TRANSITIONS: Record<OrderStatusValue, OrderStatusValue[]> = {
  pending_payment: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

/** Statuses that indicate the order generated revenue */
const REVENUE_STATUSES = new Set<OrderStatusValue>(['processing', 'shipped', 'delivered']);

/** Statuses that should trigger Authenticity TAG generation */
const TAG_TRIGGER_STATUSES = new Set<OrderStatusValue>(['shipped', 'delivered']);

export class OrderStatus {
  private constructor(private readonly _value: OrderStatusValue) {}

  static of(value: string): OrderStatus {
    if (!ORDER_STATUSES.includes(value as OrderStatusValue)) {
      throw new Error(`Invalid order status: "${value}"`);
    }
    return new OrderStatus(value as OrderStatusValue);
  }

  get value(): OrderStatusValue {
    return this._value;
  }

  canTransitionTo(next: OrderStatusValue): boolean {
    return ALLOWED_TRANSITIONS[this._value].includes(next);
  }

  /** Whether this status contributes to revenue calculations */
  countsAsRevenue(): boolean {
    return REVENUE_STATUSES.has(this._value);
  }

  /** Whether transitioning to this status should trigger TAG generation */
  shouldTriggerTagGeneration(): boolean {
    return TAG_TRIGGER_STATUSES.has(this._value);
  }

  equals(other: OrderStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }

  /** Human-readable display label */
  toLabel(): string {
    const labels: Record<OrderStatusValue, string> = {
      pending_payment: 'Pending Payment',
      paid: 'Paid',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[this._value];
  }
}
