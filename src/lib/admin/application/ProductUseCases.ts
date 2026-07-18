import { AdminProduct } from '../domain/entities/AdminProduct';
import { ProductStatusValue } from '../domain/value-objects/ProductStatus';
import {
  IAdminProductRepository,
  CreateProductInput,
  PaginationParams,
  PaginatedResult,
} from '../ports/outbound/IAdminProductRepository';

/**
 * ProductUseCases — Application Layer
 *
 * Orchestrates domain entities and repository ports.
 * Has ZERO knowledge of Supabase, Next.js, or any UI concern.
 * Receives its dependencies via constructor injection for easy unit testing.
 */
export class ProductUseCases {
  constructor(private readonly repo: IAdminProductRepository) {}

  async listProducts(params: PaginationParams): Promise<PaginatedResult<AdminProduct>> {
    return this.repo.findAll(params);
  }

  async getProduct(id: string): Promise<AdminProduct | null> {
    return this.repo.findById(id);
  }

  async createProduct(input: CreateProductInput): Promise<AdminProduct> {
    // Domain validation
    if (!input.name.trim()) throw new Error('Product name is required.');
    if (!input.slug.trim()) throw new Error('Product slug is required.');
    if (input.price < 0) throw new Error('Price cannot be negative.');
    if (input.stockQuantity < 0) throw new Error('Stock quantity cannot be negative.');

    return this.repo.create(input);
  }

  /**
   * Toggles status between draft ↔ active.
   * Uses domain entity to validate the transition, then persists via port.
   */
  async toggleProductStatus(id: string): Promise<void> {
    const product = await this.repo.findById(id);
    if (!product) throw new Error(`Product ${id} not found.`);

    const updated = product.toggleStatus();
    await this.repo.updateStatus(id, updated.status.value as ProductStatusValue);
  }

  async setProductStatus(id: string, status: ProductStatusValue): Promise<void> {
    const product = await this.repo.findById(id);
    if (!product) throw new Error(`Product ${id} not found.`);

    // Let domain validate the transition
    const updated = product.transitionStatus(status);
    await this.repo.updateStatus(id, updated.status.value as ProductStatusValue);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
