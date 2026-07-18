import { AdminContract, ContractStatusValue } from '../domain/entities/AdminContract';
import {
  IAdminContractRepository,
  CreateContractInput,
} from '../ports/outbound/IAdminContractRepository';
import { PaginationParams, PaginatedResult } from '../ports/outbound/IAdminProductRepository';

export class ContractUseCases {
  constructor(private readonly repo: IAdminContractRepository) {}

  async listContracts(params: PaginationParams): Promise<PaginatedResult<AdminContract>> {
    return this.repo.findAll(params);
  }

  async getActiveContracts(): Promise<AdminContract[]> {
    return this.repo.findAllActive();
  }

  async createContract(input: CreateContractInput): Promise<AdminContract> {
    if (input.royaltyRate < 0 || input.royaltyRate > 100) {
      throw new Error('Royalty rate must be between 0 and 100.');
    }
    if (!input.contractReference.trim()) {
      throw new Error('Contract reference is required.');
    }
    return this.repo.create(input);
  }

  async updateContractStatus(id: string, status: ContractStatusValue): Promise<void> {
    return this.repo.updateStatus(id, status);
  }
}
