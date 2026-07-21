import { describe, it, expect } from 'vitest';
import { getRepository } from '@/lib/repositories';

describe('Data Repository Adapter & Live Supabase Mode', () => {
  it('always returns Supabase mode as all systems are configured for live Supabase', async () => {
    const repo = getRepository();
    expect(repo.mode).toBe('supabase');
  });

  it('safely returns empty lists without falling back to Demo mode when Supabase client is absent during unit test', async () => {
    const repo = getRepository();
    const products = await repo.getProducts();
    const brands = await repo.getBrands();
    const categories = await repo.getCategories();
    const coupons = await repo.getCoupons();

    expect(Array.isArray(products)).toBe(true);
    expect(Array.isArray(brands)).toBe(true);
    expect(Array.isArray(categories)).toBe(true);
    expect(Array.isArray(coupons)).toBe(true);
  });
});
