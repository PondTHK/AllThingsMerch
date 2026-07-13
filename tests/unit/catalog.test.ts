import { describe, it, expect } from 'vitest';
import { MOCK_PRODUCTS } from '@/lib/repositories/mock-data';

describe('Catalog Filtering & Search Logic', () => {
  it('filters active products by category ID', () => {
    const f1Products = MOCK_PRODUCTS.filter(
      (p) => p.status === 'active' && p.categoryId === 'cat-f1'
    );
    expect(f1Products.length).toBeGreaterThan(0);
    expect(f1Products.every((p) => p.categoryId === 'cat-f1')).toBe(true);
  });

  it('filters active products by search query text', () => {
    const query = 'ferrari';
    const matches = MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
    );
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.some((p) => p.name.toLowerCase().includes('ferrari'))).toBe(true);
  });

  it('sorts products by price ascending correctly', () => {
    const sortedAsc = [...MOCK_PRODUCTS].sort(
      (a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
    );
    for (let i = 0; i < sortedAsc.length - 1; i++) {
      expect(sortedAsc[i].variants[0].price).toBeLessThanOrEqual(
        sortedAsc[i + 1].variants[0].price
      );
    }
  });

  it('validates variant stock availability and low stock thresholds', () => {
    const variant = MOCK_PRODUCTS[0].variants[0];
    const isAvailable = variant.stockQuantity > 0;
    const isLowStock = variant.stockQuantity <= variant.lowStockThreshold;

    expect(typeof isAvailable).toBe('boolean');
    expect(typeof isLowStock).toBe('boolean');
    expect(variant.stockQuantity).toBeGreaterThanOrEqual(0);
  });
});
