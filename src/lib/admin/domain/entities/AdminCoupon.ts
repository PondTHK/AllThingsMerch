/** AdminCoupon domain entity */
export type CouponDiscountType = 'percentage' | 'fixed';

export class AdminCoupon {
  constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly description: string | null,
    public readonly discountType: CouponDiscountType,
    /** For percentage: 0-100. For fixed: THB amount. */
    public readonly discountValue: number,
    public readonly minOrderValue: number | null,
    public readonly maxGlobalUses: number | null,
    public readonly currentGlobalUses: number,
    public readonly maxUsesPerUser: number | null,
    public readonly isActive: boolean,
    public readonly expiresAt: string | null,
    public readonly createdAt: string,
  ) {}

  /** A date 50+ years away is treated as "never expires" (used when no expiry was set) */
  get isNeverExpires(): boolean {
    if (!this.expiresAt) return true;
    const fiftyYearsFromNow = new Date();
    fiftyYearsFromNow.setFullYear(fiftyYearsFromNow.getFullYear() + 50);
    return new Date(this.expiresAt) > fiftyYearsFromNow;
  }

  get isExpired(): boolean {
    if (!this.expiresAt || this.isNeverExpires) return false;
    return new Date(this.expiresAt) < new Date();
  }

  get isUsable(): boolean {
    if (!this.isActive || this.isExpired) return false;
    if (this.maxGlobalUses !== null && this.currentGlobalUses >= this.maxGlobalUses) return false;
    return true;
  }

  get remainingUsages(): number | null {
    if (this.maxGlobalUses === null) return null;
    return Math.max(0, this.maxGlobalUses - this.currentGlobalUses);
  }

  /** Calculate discount amount for a given order total */
  calculateDiscount(orderTotal: number): number {
    if (!this.isUsable) return 0;
    if (this.minOrderValue !== null && orderTotal < this.minOrderValue) return 0;

    if (this.discountType === 'percentage') {
      return Math.round(orderTotal * (this.discountValue / 100));
    }
    return Math.min(this.discountValue, orderTotal);
  }
}
