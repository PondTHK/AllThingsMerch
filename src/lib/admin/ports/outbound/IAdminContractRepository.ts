import { AdminContract, ContractStatusValue } from '../../domain/entities/AdminContract';
import { PaginationParams, PaginatedResult } from './IAdminProductRepository';

export interface CreateContractInput {
  licenseHolderId: string;
  holderName: string;
  contractReference: string;
  royaltyRate: number;
  startsAt: string;
  expiresAt: string;
}

export interface IAdminContractRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<AdminContract>>;
  findAllActive(): Promise<AdminContract[]>;
  findById(id: string): Promise<AdminContract | null>;
  create(input: CreateContractInput): Promise<AdminContract>;
  updateStatus(id: string, status: ContractStatusValue): Promise<void>;
  countActive(): Promise<number>;
}
