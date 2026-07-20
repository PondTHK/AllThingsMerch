import { AdminInventoryVariant } from '../../domain/entities/AdminInventoryVariant';
import { PaginationParams, PaginatedResult } from './IAdminProductRepository';

export interface IAdminInventoryRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<AdminInventoryVariant>>;
  findLowStock(): Promise<AdminInventoryVariant[]>;
  findByProductId(productId: string): Promise<AdminInventoryVariant[]>;
  adjustStock(variantId: string, delta: number): Promise<void>;
  setStock(variantId: string, quantity: number): Promise<void>;
  /** Aggregate totals for the dashboard */
  getTotalStockUnits(): Promise<number>;
}
