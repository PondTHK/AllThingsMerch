import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminCoupon } from '../../domain/entities/AdminCoupon';
import {
  IAdminCouponRepository,
  CreateCouponInput,
} from '../../ports/outbound/IAdminCouponRepository';
import { PaginationParams, PaginatedResult } from '../../ports/outbound/IAdminProductRepository';
import { CouponMapper } from '../mappers/CouponMapper';
import { RepositoryError } from '../../domain/errors/DomainError';

export class SupabaseAdminCouponRepo implements IAdminCouponRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<AdminCoupon>> {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    // Depending on if the coupons table exists yet, this might error.
    // The use case handles it gracefully or we log it.
    const { data, count, error } = await this.client
      .from('coupons')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      if (error.code === '42P01') {
        // Table doesn't exist
        return { items: [], totalCount: 0, totalPages: 1, currentPage: params.page };
      }
      throw new RepositoryError('Failed to fetch coupons', error);
    }

    return {
      items: (data ?? []).map(CouponMapper.toDomain),
      totalCount: count ?? 0,
      totalPages: count ? Math.ceil(count / params.limit) : 1,
      currentPage: params.page,
    };
  }

  async findByCode(code: string): Promise<AdminCoupon | null> {
    const { data, error } = await this.client
      .from('coupons')
      .select('*')
      .eq('code', code)
      .single();

    if (error) return null;
    return data ? CouponMapper.toDomain(data) : null;
  }

  async create(input: CreateCouponInput): Promise<AdminCoupon> {
    const { data, error } = await this.client
      .from('coupons')
      .insert({
        code: input.code,
        discount_type: input.discountType,
        discount_value: input.discountValue,
        minimum_order_amount: input.minOrderAmount ?? null,
        usage_limit: input.maxUsageCount ?? null,
        expires_at: input.expiresAt ?? null,
        is_active: true,
        usage_count: 0,
      })
      .select()
      .single();

    if (error) throw new RepositoryError('Failed to create coupon', error);
    return CouponMapper.toDomain(data);
  }

  async toggleActive(id: string): Promise<void> {
    const { data, error: fetchErr } = await this.client
      .from('coupons')
      .select('is_active')
      .eq('id', id)
      .single();

    if (fetchErr) throw new RepositoryError(`Coupon ${id} not found`, fetchErr);

    const { error: updateErr } = await this.client
      .from('coupons')
      .update({ is_active: !data.is_active, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (updateErr) throw new RepositoryError('Failed to toggle coupon status', updateErr);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('coupons').delete().eq('id', id);
    if (error) throw new RepositoryError('Failed to delete coupon', error);
  }
}
