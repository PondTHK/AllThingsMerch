import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminInventoryVariant } from '../../domain/entities/AdminInventoryVariant';
import { IAdminInventoryRepository } from '../../ports/outbound/IAdminInventoryRepository';
import { PaginationParams, PaginatedResult } from '../../ports/outbound/IAdminProductRepository';
import { InventoryMapper } from '../mappers/InventoryMapper';
import { RepositoryError } from '../../domain/errors/DomainError';

export class SupabaseAdminInventoryRepo implements IAdminInventoryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<AdminInventoryVariant>> {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    // Notice the join to get the product name
    const { data, count, error } = await this.client
      .from('product_variants')
      .select('*, products(name)', { count: 'exact' })
      .order('sku', { ascending: true })
      .range(from, to);

    if (error) throw new RepositoryError('Failed to fetch variants', error);

    return {
      items: (data ?? []).map(InventoryMapper.toDomain),
      totalCount: count ?? 0,
      totalPages: count ? Math.ceil(count / params.limit) : 1,
      currentPage: params.page,
    };
  }

  async findLowStock(): Promise<AdminInventoryVariant[]> {
    // We cannot express stock_quantity <= low_stock_threshold purely in Supabase PostgREST easily
    // without a custom SQL function or view. Since this is an MVP, we fetch all and filter in memory,
    // OR if we know threshold is usually 3, we can do a basic filter.
    // Let's use a basic filter for <= 10 and then filter in memory for exact logic.
    const { data, error } = await this.client
      .from('product_variants')
      .select('*, products(name)')
      .lte('stock_quantity', 10); // heuristic pre-filter

    if (error) return [];
    return (data ?? [])
      .map(InventoryMapper.toDomain)
      .filter((v) => v.isLowStock);
  }

  async findByProductId(productId: string): Promise<AdminInventoryVariant[]> {
    const { data, error } = await this.client
      .from('product_variants')
      .select('*, products(name)')
      .eq('product_id', productId)
      .order('sku', { ascending: true });

    if (error) return [];
    return (data ?? []).map(InventoryMapper.toDomain);
  }

  async adjustStock(variantId: string, delta: number): Promise<void> {
    if (delta === 0) return;

    const { data: current, error: fetchErr } = await this.client
      .from('product_variants')
      .select('stock_quantity')
      .eq('id', variantId)
      .single();

    if (fetchErr) throw new RepositoryError('Failed to fetch variant for stock adjustment', fetchErr);

    const newQty = Math.max(0, (current?.stock_quantity ?? 0) + delta);

    const { error: updateErr } = await this.client
      .from('product_variants')
      .update({ stock_quantity: newQty, updated_at: new Date().toISOString() })
      .eq('id', variantId);

    if (updateErr) throw new RepositoryError('Failed to update stock', updateErr);

    // Record the movement
    await this.client.from('stock_movements').insert({
      product_variant_id: variantId,
      movement_type: delta > 0 ? 'receive' : 'adjustment',
      quantity: Math.abs(delta),
      note: 'Admin manual adjustment via Use Case',
    });
  }

  async setStock(variantId: string, quantity: number): Promise<void> {
    const { data: current, error: fetchErr } = await this.client
      .from('product_variants')
      .select('stock_quantity')
      .eq('id', variantId)
      .single();

    if (fetchErr) throw new RepositoryError('Failed to fetch variant for absolute set', fetchErr);

    const currentQty = current?.stock_quantity ?? quantity;
    const delta = quantity - currentQty;

    const { error: updateErr } = await this.client
      .from('product_variants')
      .update({ stock_quantity: quantity, updated_at: new Date().toISOString() })
      .eq('id', variantId);

    if (updateErr) throw new RepositoryError('Failed to set stock', updateErr);

    // Record the movement if there was an actual change
    if (delta !== 0) {
      await this.client.from('stock_movements').insert({
        product_variant_id: variantId,
        movement_type: delta > 0 ? 'receive' : 'adjustment',
        quantity: Math.abs(delta),
        note: 'Admin manual absolute set via Use Case',
      });
    }
  }

  async getTotalStockUnits(): Promise<number> {
    const { data, error } = await this.client
      .from('product_variants')
      .select('stock_quantity');

    if (error) return 0;
    return (data ?? []).reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
  }
}
