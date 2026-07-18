import { ProductStatus, ProductStatusValue } from '../value-objects/ProductStatus';
import { Money } from '../value-objects/Money';
import { InvalidStatusTransitionError } from '../errors/DomainError';

/** Domain entity — independent of Supabase schema or UI concerns */
export interface AdminProductVariant {
  readonly id: string;
  readonly sku: string;
  readonly size: string | null;
  readonly color: string | null;
  readonly price: Money;
  readonly compareAtPrice: Money | null;
  readonly stockQuantity: number;
  readonly lowStockThreshold: number;
  readonly isActive: boolean;
}

export interface AdminProductImage {
  readonly id: string;
  readonly storagePath: string;
  readonly altText: string;
  readonly sortOrder: number;
}

export class AdminProduct {
  constructor(
    public readonly id: string,
    public readonly brandId: string,
    public readonly categoryId: string,
    public readonly licenseContractId: string | null,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string,
    private _status: ProductStatus,
    public readonly isPreorder: boolean,
    public readonly preorderReleaseAt: string | null,
    public readonly variants: AdminProductVariant[],
    public readonly images: AdminProductImage[],
    public readonly createdAt: string,
    public readonly updatedAt: string,
    // Denormalized joins for read convenience
    public readonly brandName?: string,
    public readonly categoryName?: string,
  ) {}

  get status(): ProductStatus {
    return this._status;
  }

  get primaryVariant(): AdminProductVariant | undefined {
    return this.variants.find((v) => v.isActive) ?? this.variants[0];
  }

  get totalStock(): number {
    return this.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
  }

  get isLowStock(): boolean {
    return this.variants.some((v) => v.stockQuantity <= v.lowStockThreshold);
  }

  get minPrice(): Money {
    if (this.variants.length === 0) return Money.zero();
    return this.variants.reduce(
      (min, v) => (v.price.isLessThan(min) ? v.price : min),
      this.variants[0].price,
    );
  }

  get maxPrice(): Money {
    if (this.variants.length === 0) return Money.zero();
    return this.variants.reduce(
      (max, v) => (v.price.isGreaterThan(max) ? v.price : max),
      this.variants[0].price,
    );
  }

  /**
   * Transitions the product status.
   * @throws InvalidStatusTransitionError if the transition is not allowed.
   */
  transitionStatus(next: ProductStatusValue): AdminProduct {
    if (!this._status.canTransitionTo(next)) {
      throw new InvalidStatusTransitionError(this._status.value, next);
    }
    return this._withStatus(ProductStatus.of(next));
  }

  /** Toggle between draft ↔ active (convenience action) */
  toggleStatus(): AdminProduct {
    const nextStatus = this._status.toggle();
    return this._withStatus(nextStatus);
  }

  private _withStatus(status: ProductStatus): AdminProduct {
    return new AdminProduct(
      this.id, this.brandId, this.categoryId, this.licenseContractId,
      this.name, this.slug, this.description, status,
      this.isPreorder, this.preorderReleaseAt,
      this.variants, this.images,
      this.createdAt, new Date().toISOString(),
      this.brandName, this.categoryName,
    );
  }
}
