import { AdminOrder } from '../domain/entities/AdminOrder';
import { OrderStatusValue } from '../domain/value-objects/OrderStatus';
import { OrderStatus } from '../domain/value-objects/OrderStatus';
import {
  IAdminOrderRepository,
} from '../ports/outbound/IAdminOrderRepository';
import { IAdminTagRepository } from '../ports/outbound/IAdminTagRepository';
import { PaginationParams, PaginatedResult } from '../ports/outbound/IAdminProductRepository';

/**
 * OrderUseCases — Application Layer
 *
 * The most complex use case: manages status transitions AND
 * coordinates automatic Authenticity TAG generation via the tag port.
 * This business logic previously lived scattered in OrdersClient.tsx.
 */
export class OrderUseCases {
  constructor(
    private readonly orderRepo: IAdminOrderRepository,
    private readonly tagRepo: IAdminTagRepository,
  ) {}

  async listOrders(params: PaginationParams): Promise<PaginatedResult<AdminOrder>> {
    return this.orderRepo.findAll(params);
  }

  async getOrder(id: string): Promise<AdminOrder | null> {
    return this.orderRepo.findById(id);
  }

  /**
   * Updates order status and, when transitioning to 'shipped'/'delivered',
   * auto-generates Authenticity TAGs for any items that don't yet have one.
   *
   * This entire flow is now a single, testable use case method.
   */
  async updateOrderStatus(orderId: string, newStatus: OrderStatusValue): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error(`Order ${orderId} not found.`);

    // Validate transition via domain entity
    const updatedOrder = order.transitionTo(newStatus);

    // Persist the status change first
    await this.orderRepo.updateStatus(orderId, updatedOrder.status.value as OrderStatusValue);

    // Domain-driven: generate TAGs when status warrants it
    const nextStatus = OrderStatus.of(newStatus);
    if (nextStatus.shouldTriggerTagGeneration()) {
      await this._generatePendingTags(updatedOrder);
    }
  }

  private async _generatePendingTags(order: AdminOrder): Promise<void> {
    const itemsNeedingTags = order.itemsNeedingTags;
    if (itemsNeedingTags.length === 0) return;

    // Run tag generation in parallel — each item independently
    await Promise.allSettled(
      itemsNeedingTags.map((item) =>
        this.tagRepo.generate({
          orderItemId: item.id,
          sku: item.sku,
          productName: item.productName,
          brandName: '', // Fetched at adapter level if needed
          size: item.size,
          orderNumber: order.orderNumber,
        })
      )
    );
  }
}
