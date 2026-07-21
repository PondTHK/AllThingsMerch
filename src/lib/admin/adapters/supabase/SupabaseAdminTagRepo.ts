import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminTag, TagStatusValue } from '../../domain/entities/AdminTag';
import {
  IAdminTagRepository,
  GenerateTagInput,
} from '../../ports/outbound/IAdminTagRepository';
import { PaginationParams, PaginatedResult } from '../../ports/outbound/IAdminProductRepository';
import { TagMapper } from '../mappers/TagMapper';
import { RepositoryError } from '../../domain/errors/DomainError';

export class SupabaseAdminTagRepo implements IAdminTagRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<AdminTag>> {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    // Notice joins if required by schema. Schema might vary, so we fetch standard fields.
    const { data, count, error } = await this.client
      .from('authenticity_tags')
      .select('*, order_items(product_name, sku, variant_name, orders(order_number))', { count: 'exact' })
      .order('issued_at', { ascending: false })
      .range(from, to);

    if (error) throw new RepositoryError('Failed to fetch tags', error);

    return {
      items: (data ?? []).map(TagMapper.toDomain),
      totalCount: count ?? 0,
      totalPages: count ? Math.ceil(count / params.limit) : 1,
      currentPage: params.page,
    };
  }

  async findByOrderItemId(orderItemId: string): Promise<AdminTag | null> {
    const { data, error } = await this.client
      .from('authenticity_tags')
      .select('*, order_items(product_name, sku, variant_name, orders(order_number))')
      .eq('order_item_id', orderItemId)
      .single();

    if (error) return null;
    return data ? TagMapper.toDomain(data) : null;
  }

  async generate(input: GenerateTagInput): Promise<AdminTag> {
    // Check if tag already exists to prevent duplicates
    const existing = await this.findByOrderItemId(input.orderItemId);
    if (existing) return existing;

    // Generate unique code and serial
    const uniqueCode = `ATM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const baseSku = input.sku.split('-')[0] || 'VAR';
    const serial = `SN-${baseSku}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const { data, error } = await this.client
      .from('authenticity_tags')
      .insert({
        order_item_id: input.orderItemId,
        public_code: uniqueCode,
        serial_number: serial,
        status: 'issued',
      })
      .select('*, order_items(product_name, sku, variant_name, orders(order_number))')
      .single();

    if (error) throw new RepositoryError('Failed to generate TAG', error);
    return TagMapper.toDomain(data);
  }

  async updateStatus(id: string, status: TagStatusValue): Promise<void> {
    const { error } = await this.client
      .from('authenticity_tags')
      .update({ status })
      .eq('id', id);

    if (error) throw new RepositoryError('Failed to update tag status', error);
  }
}
