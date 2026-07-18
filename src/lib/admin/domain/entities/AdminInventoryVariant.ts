import { Money } from '../value-objects/Money';
import { InsufficientStockError } from '../errors/DomainError';

/** Represents a single variant row in the inventory view */
export class AdminInventoryVariant {
  constructor(
    public readonly id: string,
    public readonly productId: string,
    public readonly productName: string,
    public readonly sku: string,
    public readonly size: string | null,
    public readonly color: string | null,
    public readonly price: Money,
    private _stockQuantity: number,
    public readonly lowStockThreshold: number,
    public readonly isActive: boolean,
  ) {}

  get stockQuantity(): number {
    return this._stockQuantity;
  }

  get isLowStock(): boolean {
    return this._stockQuantity <= this.lowStockThreshold;
  }

  get isOutOfStock(): boolean {
    return this._stockQuantity === 0;
  }

  /**
   * Returns a new variant with adjusted stock.
   * @param delta Positive = restock, Negative = deduct
   * @throws InsufficientStockError if deduction would go below zero
   */
  adjustStock(delta: number): AdminInventoryVariant {
    const newQty = this._stockQuantity + delta;
    if (newQty < 0) {
      throw new InsufficientStockError(this.id, Math.abs(delta), this._stockQuantity);
    }
    return new AdminInventoryVariant(
      this.id, this.productId, this.productName, this.sku,
      this.size, this.color, this.price,
      newQty, this.lowStockThreshold, this.isActive,
    );
  }
}
