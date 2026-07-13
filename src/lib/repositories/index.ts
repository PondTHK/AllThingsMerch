import { Product, Brand, Category } from '@/types';
import {
  getAllProducts as getMockProducts,
  getProductBySlug as getMockProductBySlug,
  MOCK_BRANDS,
  MOCK_CATEGORIES,
} from './mock-data';
import { isSupabaseConfigured, getSupabaseBrowserClient } from '@/lib/supabase/client';

export interface DataRepository {
  mode: 'demo' | 'supabase';
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getBrands(): Promise<Brand[]>;
  getCategories(): Promise<Category[]>;
}

class DemoRepository implements DataRepository {
  mode = 'demo' as const;

  async getProducts(): Promise<Product[]> {
    return getMockProducts();
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return getMockProductBySlug(slug);
  }

  async getBrands(): Promise<Brand[]> {
    return MOCK_BRANDS;
  }

  async getCategories(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  }
}

class SupabaseRepository implements DataRepository {
  mode = 'supabase' as const;

  async getProducts(): Promise<Product[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return getMockProducts();

    const { data, error } = await client
      .from('products')
      .select('*, brands(*), categories(*), product_variants(*)')
      .eq('status', 'active');

    if (error || !data) {
      console.warn('Supabase fetch failed, falling back to Demo mode', error);
      return getMockProducts();
    }

    return data as unknown as Product[];
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const client = getSupabaseBrowserClient();
    if (!client) return getMockProductBySlug(slug);

    const { data, error } = await client
      .from('products')
      .select('*, brands(*), categories(*), product_variants(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return getMockProductBySlug(slug);
    }

    return data as unknown as Product;
  }

  async getBrands(): Promise<Brand[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return MOCK_BRANDS;

    const { data, error } = await client.from('brands').select('*').eq('is_active', true);
    return error || !data ? MOCK_BRANDS : data;
  }

  async getCategories(): Promise<Category[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return MOCK_CATEGORIES;

    const { data, error } = await client.from('categories').select('*');
    return error || !data ? MOCK_CATEGORIES : data;
  }
}

export function getRepository(): DataRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseRepository();
  }
  return new DemoRepository();
}
