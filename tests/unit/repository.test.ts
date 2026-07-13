import { describe, it, expect } from 'vitest';
import { getRepository } from '@/lib/repositories';
import { isSupabaseConfigured } from '@/lib/supabase/client';

describe('Data Repository Adapter & Mode Switching', () => {
  it('defaults to Demo mode when Supabase credentials are not provided', async () => {
    expect(isSupabaseConfigured()).toBe(false);
    const repo = getRepository();
    expect(repo.mode).toBe('demo');

    const products = await repo.getProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0].id).toBeDefined();

    const polo = await repo.getProductBySlug('red-bull-racing-2026-team-polo');
    expect(polo).toBeDefined();
    expect(polo?.name).toContain('Red Bull');
  });

  it('fetches brands and categories in Demo mode accurately', async () => {
    const repo = getRepository();
    const brands = await repo.getBrands();
    const categories = await repo.getCategories();

    expect(brands.length).toBeGreaterThan(0);
    expect(categories.length).toBeGreaterThan(0);
  });
});
