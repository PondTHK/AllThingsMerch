import { AdminBrand } from '../../domain/entities/AdminBrand';
import { PaginationParams, PaginatedResult } from './IAdminProductRepository';

export interface CreateBrandInput {
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
}

export interface IAdminBrandRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<AdminBrand>>;
  findAllActive(): Promise<AdminBrand[]>;
  findById(id: string): Promise<AdminBrand | null>;
  create(input: CreateBrandInput): Promise<AdminBrand>;
  toggleActive(id: string): Promise<void>;
}
