import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminBrand } from '../../domain/entities/AdminBrand';
import {
  IAdminBrandRepository,
  CreateBrandInput,
} from '../../ports/outbound/IAdminBrandRepository';
import { PaginationParams, PaginatedResult } from '../../ports/outbound/IAdminProductRepository';
import { BrandMapper } from '../mappers/BrandMapper';
import { RepositoryError } from '../../domain/errors/DomainError';

export class SupabaseAdminBrandRepo implements IAdminBrandRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<AdminBrand>> {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    const { data, count, error } = await this.client
      .from('brands')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(from, to);

    if (error) throw new RepositoryError('Failed to fetch brands', error);

    return {
      items: (data ?? []).map(BrandMapper.toDomain),
      totalCount: count ?? 0,
      totalPages: count ? Math.ceil(count / params.limit) : 1,
      currentPage: params.page,
    };
  }

  async findAllActive(): Promise<AdminBrand[]> {
    const { data, error } = await this.client
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) return [];
    return (data ?? []).map(BrandMapper.toDomain);
  }

  async findById(id: string): Promise<AdminBrand | null> {
    const { data, error } = await this.client
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data ? BrandMapper.toDomain(data) : null;
  }

  async create(input: CreateBrandInput): Promise<AdminBrand> {
    const { data, error } = await this.client
      .from('brands')
      .insert({
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        logo_url: input.logoUrl ?? null,
        is_active: true,
      })
      .select()
      .single();

    if (error) throw new RepositoryError('Failed to create brand', error);
    return BrandMapper.toDomain(data);
  }

  async toggleActive(id: string): Promise<void> {
    const brand = await this.findById(id);
    if (!brand) throw new RepositoryError(`Brand ${id} not found`);

    const { error } = await this.client
      .from('brands')
      .update({ is_active: !brand.isActive })
      .eq('id', id);

    if (error) throw new RepositoryError('Failed to toggle brand status', error);
  }
}
