/** AdminCoupon domain entity */
export type CouponDiscountType = 'percentage' | 'fixed';

export class AdminCoupon {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly discountType: CouponDiscountType,
    /** For percentage: 0-100. For fixed: THB amount. */
    public readonly discountValue: number,
    public readonly minOrderAmount: number | null,
    public readonly maxUsageCount: number | null,
    public readonly usageCount: number,
    public readonly maxUsesPerUser: number | null,
    public readonly isActive: boolean,
    public readonly expiresAt: string | null,
    public readonly createdAt: string,
  ) {}

  get isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date(this.expiresAt) < new Date();
  }

  get isUsable(): boolean {
    if (!this.isActive || this.isExpired) return false;
    if (this.maxUsageCount !== null && this.usageCount >= this.maxUsageCount) return false;
    return true;
  }

  get remainingUsages(): number | null {
    if (this.maxUsageCount === null) return null;
    return Math.max(0, this.maxUsageCount - this.usageCount);
  }

  /** Calculate discount amount for a given order total */
  calculateDiscount(orderTotal: number): number {
    if (!this.isUsable) return 0;
    if (this.minOrderAmount !== null && orderTotal < this.minOrderAmount) return 0;

    if (this.discountType === 'percentage') {
      return Math.round(orderTotal * (this.discountValue / 100));
    }
    return Math.min(this.discountValue, orderTotal);
  }
}
