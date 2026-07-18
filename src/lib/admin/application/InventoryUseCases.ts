import { AdminInventoryVariant } from '../domain/entities/AdminInventoryVariant';
import { IAdminInventoryRepository } from '../ports/outbound/IAdminInventoryRepository';
import { PaginationParams, PaginatedResult } from '../ports/outbound/IAdminProductRepository';

export class InventoryUseCases {
  constructor(private readonly repo: IAdminInventoryRepository) {}

  async listVariants(params: PaginationParams): Promise<PaginatedResult<AdminInventoryVariant>> {
    return this.repo.findAll(params);
  }

  async getLowStockVariants(): Promise<AdminInventoryVariant[]> {
    return this.repo.findLowStock();
  }

  async getVariantsByProduct(productId: string): Promise<AdminInventoryVariant[]> {
    return this.repo.findByProductId(productId);
  }

  /**
   * Adjusts stock by a relative delta (+/-).
   * Validates in domain entity before persisting.
   */
  async adjustStock(variantId: string, delta: number): Promise<void> {
    // We could fetch first to validate in domain, but for performance
    // we delegate guard to the repository which can do it atomically (DB constraint).
    // If stricter pre-validation is needed, uncomment the block below:
    //
    // const variant = await this.repo.findById(variantId);
    // if (!variant) throw new Error(`Variant ${variantId} not found.`);
    // variant.adjustStock(delta); // throws InsufficientStockError if invalid
    //
    return this.repo.adjustStock(variantId, delta);
  }

  async setStock(variantId: string, quantity: number): Promise<void> {
    if (quantity < 0) throw new Error('Stock quantity cannot be negative.');
    return this.repo.setStock(variantId, quantity);
  }
}
