import {
  AdminOrder,
  AdminOrderItem,
  AdminShippingAddress,
} from '../../domain/entities/AdminOrder';
import { OrderStatus } from '../../domain/value-objects/OrderStatus';
import { Money } from '../../domain/value-objects/Money';

export class OrderMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminOrder {
    const rawAddress = row.shipping_address ?? {};
    const shippingAddress: AdminShippingAddress = {
      fullName: rawAddress.fullName ?? rawAddress.full_name ?? rawAddress.name ?? '',
      email: rawAddress.email ?? '',
      phone: rawAddress.phone ?? '',
      street: rawAddress.street ?? '',
      city: rawAddress.city ?? '',
      postalCode: rawAddress.postalCode ?? rawAddress.postal_code ?? '',
    };

    const items: AdminOrderItem[] = (row.order_items ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: Record<string, any>): AdminOrderItem => {
        const tag = item.authenticity_tags?.[0] ?? null;
        return {
          id: item.id,
          variantId: item.product_variant_id ?? '',
          productId: item.product_id ?? '',
          productName: item.product_name ?? '',
          sku: item.sku ?? '',
          size: item.size ?? null,
          unitPrice: Money.fromTHB(Number(item.unit_price) || 0),
          quantity: Number(item.quantity) || 1,
          tagCode: tag?.public_code ?? null,
          tagSerialNumber: tag?.serial_number ?? null,
        };
      }
    );

    return new AdminOrder(
      row.id,
      row.order_number ?? '',
      OrderStatus.of(row.status ?? 'pending_payment'),
      items,
      Money.fromTHB(Number(row.subtotal) || 0),
      Money.fromTHB(Number(row.shipping_amount) || 0),
      Money.fromTHB(Number(row.total_amount) || 0),
      shippingAddress,
      row.payment_method ?? '',
      row.created_at ?? new Date().toISOString(),
    );
  }
}
