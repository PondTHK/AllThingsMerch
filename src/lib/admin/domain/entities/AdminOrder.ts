import { OrderStatus, OrderStatusValue } from '../value-objects/OrderStatus';
import { Money } from '../value-objects/Money';
import { InvalidStatusTransitionError } from '../errors/DomainError';

export interface AdminShippingAddress {
  readonly fullName: string;
  readonly email: string;
  readonly phone: string;
  readonly street: string;
  readonly city: string;
  readonly postalCode: string;
}

export interface AdminOrderItem {
  readonly id: string;
  readonly variantId: string;
  readonly productId: string;
  readonly productName: string;
  readonly sku: string;
  readonly size: string | null;
  readonly unitPrice: Money;
  readonly quantity: number;
  /** TAG code if already generated for this item */
  readonly tagCode: string | null;
  readonly tagSerialNumber: string | null;
}

export class AdminOrder {
  constructor(
    public readonly id: string,
    public readonly orderNumber: string,
    private _status: OrderStatus,
    public readonly items: AdminOrderItem[],
    public readonly subtotal: Money,
    public readonly shippingFee: Money,
    public readonly totalAmount: Money,
    public readonly shippingAddress: AdminShippingAddress,
    public readonly paymentMethod: string,
    public readonly createdAt: string,
  ) {}

  get status(): OrderStatus {
    return this._status;
  }

  get itemsNeedingTags(): AdminOrderItem[] {
    return this.items.filter((item) => item.tagCode === null);
  }

  get hasPendingTags(): boolean {
    return this.itemsNeedingTags.length > 0;
  }

  /**
   * Transitions order to a new status.
   * @throws InvalidStatusTransitionError if the transition is not allowed.
   */
  transitionTo(next: OrderStatusValue): AdminOrder {
    if (!this._status.canTransitionTo(next)) {
      throw new InvalidStatusTransitionError(this._status.value, next);
    }
    return this._withStatus(OrderStatus.of(next));
  }

  private _withStatus(status: OrderStatus): AdminOrder {
    return new AdminOrder(
      this.id, this.orderNumber, status,
      this.items, this.subtotal, this.shippingFee, this.totalAmount,
      this.shippingAddress, this.paymentMethod, this.createdAt,
    );
  }
}
