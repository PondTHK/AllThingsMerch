import { AdminCoupon } from '../domain/entities/AdminCoupon';
import {
  IAdminCouponRepository,
  CreateCouponInput,
} from '../ports/outbound/IAdminCouponRepository';
import { PaginationParams, PaginatedResult } from '../ports/outbound/IAdminProductRepository';

export class CouponUseCases {
  constructor(private readonly repo: IAdminCouponRepository) {}

  async listCoupons(params: PaginationParams): Promise<PaginatedResult<AdminCoupon>> {
    return this.repo.findAll(params);
  }

  async createCoupon(input: CreateCouponInput): Promise<AdminCoupon> {
    if (!input.code.trim()) throw new Error('Coupon code is required.');
    if (input.discountValue <= 0) throw new Error('Discount value must be positive.');
    if (input.discountType === 'percentage' && input.discountValue > 100) {
      throw new Error('Percentage discount cannot exceed 100%.');
    }
    return this.repo.create(input);
  }

  async toggleCouponActive(id: string): Promise<void> {
    return this.repo.toggleActive(id);
  }

  async deleteCoupon(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
