import { AdminBrand } from '../domain/entities/AdminBrand';
import {
  IAdminBrandRepository,
  CreateBrandInput,
} from '../ports/outbound/IAdminBrandRepository';
import { PaginationParams, PaginatedResult } from '../ports/outbound/IAdminProductRepository';

export class BrandUseCases {
  constructor(private readonly repo: IAdminBrandRepository) {}

  async listBrands(params: PaginationParams): Promise<PaginatedResult<AdminBrand>> {
    return this.repo.findAll(params);
  }

  async listActiveBrands(): Promise<AdminBrand[]> {
    return this.repo.findAllActive();
  }

  async createBrand(input: CreateBrandInput): Promise<AdminBrand> {
    if (!input.name.trim()) throw new Error('Brand name is required.');
    if (!input.slug.trim()) throw new Error('Brand slug is required.');
    return this.repo.create(input);
  }

  async toggleBrandActive(id: string): Promise<void> {
    return this.repo.toggleActive(id);
  }
}
