import { AdminCoupon } from '../../domain/entities/AdminCoupon';
import { PaginationParams, PaginatedResult } from './IAdminProductRepository';

export interface CreateCouponInput {
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxGlobalUses?: number;
  maxUsesPerUser?: number;
  isActive?: boolean;
  expiresAt?: string;
}

export interface IAdminCouponRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<AdminCoupon>>;
  findByCode(code: string): Promise<AdminCoupon | null>;
  create(input: CreateCouponInput): Promise<AdminCoupon>;
  toggleActive(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
