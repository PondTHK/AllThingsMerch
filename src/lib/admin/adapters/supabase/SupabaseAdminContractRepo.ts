import type { SupabaseClient } from '@supabase/supabase-js';
import { AdminContract, ContractStatusValue } from '../../domain/entities/AdminContract';
import {
  IAdminContractRepository,
  CreateContractInput,
} from '../../ports/outbound/IAdminContractRepository';
import { PaginationParams, PaginatedResult } from '../../ports/outbound/IAdminProductRepository';
import { ContractMapper } from '../mappers/ContractMapper';
import { RepositoryError } from '../../domain/errors/DomainError';

export class SupabaseAdminContractRepo implements IAdminContractRepository {
  constructor(private readonly client: SupabaseClient) {}

  async findAll(params: PaginationParams): Promise<PaginatedResult<AdminContract>> {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;

    const { data, count, error } = await this.client
      .from('license_contracts')
      .select('*, license_holders(name)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw new RepositoryError('Failed to fetch contracts', error);

    return {
      items: (data ?? []).map(ContractMapper.toDomain),
      totalCount: count ?? 0,
      totalPages: count ? Math.ceil(count / params.limit) : 1,
      currentPage: params.page,
    };
  }

  async findAllActive(): Promise<AdminContract[]> {
    const { data, error } = await this.client
      .from('license_contracts')
      .select('*, license_holders(name)')
      .eq('status', 'active');

    if (error) return [];
    return (data ?? []).map(ContractMapper.toDomain);
  }

  async findById(id: string): Promise<AdminContract | null> {
    const { data, error } = await this.client
      .from('license_contracts')
      .select('*, license_holders(name)')
      .eq('id', id)
      .single();

    if (error) return null;
    return data ? ContractMapper.toDomain(data) : null;
  }

  async create(input: CreateContractInput): Promise<AdminContract> {
    const { data, error } = await this.client
      .from('license_contracts')
      .insert({
        license_holder_id: input.licenseHolderId,
        holder_name: input.holderName, // optional denormalization if schema uses it
        contract_reference: input.contractReference,
        royalty_rate: input.royaltyRate,
        starts_at: input.startsAt,
        expires_at: input.expiresAt,
        status: 'active',
      })
      .select('*, license_holders(name)')
      .single();

    if (error) throw new RepositoryError('Failed to create contract', error);
    return ContractMapper.toDomain(data);
  }

  async updateStatus(id: string, status: ContractStatusValue): Promise<void> {
    const { error } = await this.client
      .from('license_contracts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new RepositoryError('Failed to update contract status', error);
  }

  async countActive(): Promise<number> {
    const { count, error } = await this.client
      .from('license_contracts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) return 0;
    return count ?? 0;
  }
}
