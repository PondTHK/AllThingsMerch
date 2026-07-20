import { AdminInventoryVariant } from '../../domain/entities/AdminInventoryVariant';
import { Money } from '../../domain/value-objects/Money';

export class InventoryMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminInventoryVariant {
    return new AdminInventoryVariant(
      row.id,
      row.product_id ?? '',
      row.products?.name ?? row.product_name ?? '',
      row.sku ?? '',
      row.size ?? null,
      row.color ?? null,
      Money.fromTHB(Number(row.price) || 0),
      Number(row.stock_quantity) || 0,
      Number(row.low_stock_threshold) || 3,
      row.is_active ?? true,
    );
  }
}
