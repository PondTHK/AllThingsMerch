import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminProduct } from '../../domain/entities/AdminProduct';
import { ProductStatusValue } from '../../domain/value-objects/ProductStatus';
import {
  IAdminProductRepository,
  CreateProductInput,
  PaginationParams,
  PaginatedResult,
} from '../../ports/outbound/IAdminProductRepository';
import { ProductMapper } from '../mappers/ProductMapper';
import { RepositoryError } from '../../domain/errors/DomainError';

/**
 * SupabaseAdminProductRepo — Supabase implementation of IAdminProductRepository.
 *
 * This is the ONLY place in the admin domain that knows about Supabase.
 * To swap to a different database, create a new class implementing the same interface.
 */
export class SupabaseAdminProductRepo implements IAdminProductRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<AdminProduct>> {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    const { data, count, error } = await this.client
      .from('products')
      .select('*, product_variants(*), brands(name), categories(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new RepositoryError('Failed to fetch products', error);

    return {
      items: (data ?? []).map(ProductMapper.toDomain),
      totalCount: count ?? 0,
      totalPages: count ? Math.ceil(count / params.limit) : 1,
      currentPage: params.page,
    };
  }

  async findById(id: string): Promise<AdminProduct | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*, product_variants(*), product_images(*), brands(name), categories(name)')
      .eq('id', id)
      .single();

    if (error) return null;
    return data ? ProductMapper.toDomain(data) : null;
  }

  async create(input: CreateProductInput): Promise<AdminProduct> {
    // 1. Insert product
    const { data: newProduct, error: productError } = await this.client
      .from('products')
      .insert({
        brand_id: input.brandId,
        category_id: input.categoryId,
        license_contract_id: input.licenseContractId ?? null,
        name: input.name,
        slug: input.slug,
        description: input.description,
        status: 'active',
        is_preorder: input.isPreorder,
      })
      .select()
      .single();

    if (productError) throw new RepositoryError('Failed to create product', productError);

    // 2. Insert initial variant (atomic: rollback if fails)
    const { data: newVariant, error: variantError } = await this.client
      .from('product_variants')
      .insert({
        product_id: newProduct.id,
        sku: input.sku,
        size: 'ONE SIZE',
        price: input.price,
        stock_quantity: input.stockQuantity,
        low_stock_threshold: input.lowStockThreshold ?? 3,
        is_active: true,
      })
      .select()
      .single();

    if (variantError) {
      // Best-effort rollback
      await this.client.from('products').delete().eq('id', newProduct.id);
      throw new RepositoryError('Failed to create product variant', variantError);
    }

    return ProductMapper.toDomain({ ...newProduct, product_variants: [newVariant] });
  }

  async updateStatus(id: string, status: ProductStatusValue): Promise<void> {
    const { error } = await this.client
      .from('products')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new RepositoryError('Failed to update product status', error);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from('products').delete().eq('id', id);
    if (error) throw new RepositoryError('Failed to delete product', error);
  }
}
