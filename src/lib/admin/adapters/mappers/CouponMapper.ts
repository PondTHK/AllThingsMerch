import { AdminCoupon, CouponDiscountType } from '../../domain/entities/AdminCoupon';

export class CouponMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminCoupon {
    return new AdminCoupon(
      row.id,
      row.code ?? '',
      row.description ?? null,
      (row.discount_type ?? 'fixed') as CouponDiscountType,
      Number(row.discount_value) || 0,
      row.min_order_value != null ? Number(row.min_order_value) : null,
      row.max_global_uses != null ? Number(row.max_global_uses) : null,
      Number(row.current_global_uses) || 0,
      row.max_uses_per_user != null ? Number(row.max_uses_per_user) : null,
      row.is_active ?? true,
      row.expires_at ?? null,
      row.created_at ?? new Date().toISOString(),
    );
  }
}
