import { AdminCoupon, CouponDiscountType } from '../../domain/entities/AdminCoupon';

export class CouponMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminCoupon {
    return new AdminCoupon(
      row.id,
      row.code ?? '',
      (row.discount_type ?? 'fixed') as CouponDiscountType,
      Number(row.discount_value) || 0,
      row.minimum_order_amount != null ? Number(row.minimum_order_amount) : null,
      row.usage_limit != null ? Number(row.usage_limit) : null,
      Number(row.usage_count) || 0,
      row.is_active ?? true,
      row.expires_at ?? null,
      row.created_at ?? new Date().toISOString(),
    );
  }
}
