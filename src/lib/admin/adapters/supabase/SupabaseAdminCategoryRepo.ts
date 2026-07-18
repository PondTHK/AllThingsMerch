import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminCategory } from '../../domain/entities/AdminCategory';
import {
  IAdminCategoryRepository,
  CreateCategoryInput,
} from '../../ports/outbound/IAdminCategoryRepository';
import { PaginationParams, PaginatedResult } from '../../ports/outbound/IAdminProductRepository';
import { CategoryMapper } from '../mappers/CategoryMapper';
import { RepositoryError } from '../../domain/errors/DomainError';

export class SupabaseAdminCategoryRepo implements IAdminCategoryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<AdminCategory>> {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    const { data, count, error } = await this.client
      .from('categories')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true })
      .range(from, to);

    if (error) throw new RepositoryError('Failed to fetch categories', error);

    return {
      items: (data ?? []).map(CategoryMapper.toDomain),
      totalCount: count ?? 0,
      totalPages: count ? Math.ceil(count / params.limit) : 1,
      currentPage: params.page,
    };
  }

  async findAllFlat(): Promise<AdminCategory[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) return [];
    return (data ?? []).map(CategoryMapper.toDomain);
  }

  async findById(id: string): Promise<AdminCategory | null> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data ? CategoryMapper.toDomain(data) : null;
  }

  async create(input: CreateCategoryInput): Promise<AdminCategory> {
    const { data, error } = await this.client
      .from('categories')
      .insert({
        name: input.name,
        slug: input.slug,
        parent_id: input.parentId ?? null,
      })
      .select()
      .single();

    if (error) throw new RepositoryError('Failed to create category', error);
    return CategoryMapper.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw new RepositoryError('Failed to delete category', error);
  }
}
