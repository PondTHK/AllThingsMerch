import { AdminProduct } from '../../domain/entities/AdminProduct';
import { ProductStatusValue } from '../../domain/value-objects/ProductStatus';

export interface CreateProductInput {
  brandId: string;
  categoryId: string;
  licenseContractId?: string;
  name: string;
  slug: string;
  description: string;
  isPreorder: boolean;
  // Initial variant
  sku: string;
  price: number; // THB
  stockQuantity: number;
  lowStockThreshold?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Outbound Port — defines what the application layer needs from persistence.
 * The Supabase adapter implements this interface. Swap for any DB without
 * changing application or domain code.
 */
export interface IAdminProductRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<AdminProduct>>;
  findById(id: string): Promise<AdminProduct | null>;
  create(input: CreateProductInput): Promise<AdminProduct>;
  updateStatus(id: string, status: ProductStatusValue): Promise<void>;
  delete(id: string): Promise<void>;
}
