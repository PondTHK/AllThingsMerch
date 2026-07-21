import { AdminTag, TagStatusValue } from '../../domain/entities/AdminTag';

export class TagMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminTag {
    return new AdminTag(
      row.id,
      row.order_item_id ?? '',
      row.public_code ?? '',
      row.serial_number ?? '',
      row.order_items?.product_name ?? row.product_name ?? '',
      row.brand_name ?? '',
      row.sku ?? row.order_items?.sku ?? '',
      row.size ?? row.order_items?.variant_name ?? null,
      (row.status ?? 'active') as TagStatusValue,
      row.issued_at ?? row.created_at ?? new Date().toISOString(),
      row.order_items?.orders?.order_number ?? row.orders?.order_number ?? row.order_number ?? null,
    );
  }
}
