import { AdminProduct, AdminProductVariant, AdminProductImage } from '../../domain/entities/AdminProduct';
import { ProductStatus } from '../../domain/value-objects/ProductStatus';
import { Money } from '../../domain/value-objects/Money';

/**
 * ProductMapper — Anti-Corruption Layer
 *
 * Translates raw Supabase rows (snake_case, untyped) into typed Domain Entities.
 * The domain never sees snake_case column names. This is the ONLY place that knows
 * the Supabase schema. If the schema changes, only this file changes.
 */
export class ProductMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminProduct {
    const variants: AdminProductVariant[] = (row.product_variants ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (v: Record<string, any>): AdminProductVariant => ({
        id: v.id,
        sku: v.sku ?? '',
        size: v.size ?? null,
        color: v.color ?? null,
        price: Money.fromTHB(Number(v.price) || 0),
        compareAtPrice: v.compare_at_price != null ? Money.fromTHB(Number(v.compare_at_price)) : null,
        stockQuantity: Number(v.stock_quantity) || 0,
        lowStockThreshold: Number(v.low_stock_threshold) || 3,
        isActive: v.is_active ?? true,
      })
    );

    const images: AdminProductImage[] = (row.product_images ?? []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (img: Record<string, any>): AdminProductImage => ({
        id: img.id,
        storagePath: img.storage_path ?? '',
        altText: img.alt_text ?? '',
        sortOrder: Number(img.sort_order) || 0,
      })
    );

    return new AdminProduct(
      row.id,
      row.brand_id,
      row.category_id,
      row.license_contract_id ?? null,
      row.name ?? '',
      row.slug ?? '',
      row.description ?? '',
      ProductStatus.of(row.status ?? 'draft'),
      row.is_preorder ?? false,
      row.preorder_release_at ?? null,
      variants,
      images,
      row.created_at ?? new Date().toISOString(),
      row.updated_at ?? new Date().toISOString(),
      row.brands?.name ?? undefined,
      row.categories?.name ?? undefined,
    );
  }
}
