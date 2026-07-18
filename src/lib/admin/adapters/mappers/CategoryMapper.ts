import { AdminCategory } from '../../domain/entities/AdminCategory';

export class CategoryMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminCategory {
    return new AdminCategory(
      row.id,
      row.name ?? '',
      row.slug ?? '',
      row.parent_id ?? null,
      row.created_at ?? new Date().toISOString(),
    );
  }
}
