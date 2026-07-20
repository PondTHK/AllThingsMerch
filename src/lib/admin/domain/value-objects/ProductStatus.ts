/**
 * ProductStatus Value Object
 *
 * Encapsulates all valid product lifecycle states and their transition rules.
 * Pure TypeScript — no framework dependency.
 */

export const PRODUCT_STATUSES = ['draft', 'active', 'archived'] as const;
export type ProductStatusValue = (typeof PRODUCT_STATUSES)[number];

/** Allowed transitions: from → to[] */
const ALLOWED_TRANSITIONS: Record<ProductStatusValue, ProductStatusValue[]> = {
  draft: ['active', 'archived'],
  active: ['draft', 'archived'],
  archived: ['draft'],
};

export class ProductStatus {
  private constructor(private readonly _value: ProductStatusValue) {}

  static of(value: string): ProductStatus {
    if (!PRODUCT_STATUSES.includes(value as ProductStatusValue)) {
      throw new Error(`Invalid product status: "${value}"`);
    }
    return new ProductStatus(value as ProductStatusValue);
  }

  static draft(): ProductStatus {
    return new ProductStatus('draft');
  }

  static active(): ProductStatus {
    return new ProductStatus('active');
  }

  static archived(): ProductStatus {
    return new ProductStatus('archived');
  }

  get value(): ProductStatusValue {
    return this._value;
  }

  isActive(): boolean {
    return this._value === 'active';
  }

  isDraft(): boolean {
    return this._value === 'draft';
  }

  isArchived(): boolean {
    return this._value === 'archived';
  }

  /** Returns true if transition to `next` is permitted. */
  canTransitionTo(next: ProductStatusValue): boolean {
    return ALLOWED_TRANSITIONS[this._value].includes(next);
  }

  /** Toggle between draft ↔ active (common admin action). */
  toggle(): ProductStatus {
    return new ProductStatus(this._value === 'active' ? 'draft' : 'active');
  }

  equals(other: ProductStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
