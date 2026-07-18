import { AdminBrand } from '../../domain/entities/AdminBrand';

export class BrandMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminBrand {
    return new AdminBrand(
      row.id,
      row.name ?? '',
      row.slug ?? '',
      row.description ?? null,
      row.logo_url ?? null,
      row.is_active ?? true,
      row.created_at ?? new Date().toISOString(),
    );
  }
}
