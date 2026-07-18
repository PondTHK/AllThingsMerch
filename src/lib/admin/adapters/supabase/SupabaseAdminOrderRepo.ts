import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminOrder } from '../../domain/entities/AdminOrder';
import { OrderStatusValue } from '../../domain/value-objects/OrderStatus';
import { IAdminOrderRepository } from '../../ports/outbound/IAdminOrderRepository';
import { PaginationParams, PaginatedResult } from '../../ports/outbound/IAdminProductRepository';
import { OrderMapper } from '../mappers/OrderMapper';
import { RepositoryError } from '../../domain/errors/DomainError';

export class SupabaseAdminOrderRepo implements IAdminOrderRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<AdminOrder>> {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    const { data, count, error } = await this.client
      .from('orders')
      .select('*, order_items(*, authenticity_tags(*))', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new RepositoryError('Failed to fetch orders', error);

    return {
      items: (data ?? []).map(OrderMapper.toDomain),
      totalCount: count ?? 0,
      totalPages: count ? Math.ceil(count / params.limit) : 1,
      currentPage: params.page,
    };
  }

  async findById(id: string): Promise<AdminOrder | null> {
    const { data, error } = await this.client
      .from('orders')
      .select('*, order_items(*, authenticity_tags(*))')
      .eq('id', id)
      .single();

    if (error) return null;
    return data ? OrderMapper.toDomain(data) : null;
  }

  async updateStatus(id: string, status: OrderStatusValue): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new RepositoryError('Failed to update order status', error);
  }

  async sumRevenue(): Promise<number> {
    const { data, error } = await this.client
      .from('orders')
      .select('total_amount, status');

    if (error) return 0;

    return (data ?? [])
      .filter((o) => ['processing', 'shipped', 'delivered'].includes(o.status))
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
  }

  async count(): Promise<number> {
    const { count, error } = await this.client
      .from('orders')
      .select('*', { count: 'exact', head: true });

    if (error) return 0;
    return count ?? 0;
  }
}
