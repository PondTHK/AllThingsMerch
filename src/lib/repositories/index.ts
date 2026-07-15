import { Product, Brand, Category, Coupon } from '@/types';
import {
  getAllProducts as getMockProducts,
  getProductBySlug as getMockProductBySlug,
  MOCK_BRANDS,
  MOCK_CATEGORIES,
  getCoupons as getMockCoupons,
  getCouponByCode as getMockCouponByCode,
  createCoupon as createMockCoupon,
  updateCoupon as updateMockCoupon,
  deleteCoupon as deleteMockCoupon,
} from './mock-data';
import { isSupabaseConfigured, getSupabaseBrowserClient } from '@/lib/supabase/client';

export interface DataRepository {
  mode: 'demo' | 'supabase';
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getBrands(): Promise<Brand[]>;
  getCategories(): Promise<Category[]>;
  
  getCoupons(): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: Omit<Coupon, 'id' | 'createdAt' | 'currentGlobalUses'>): Promise<Coupon>;
  updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon>;
  deleteCoupon(id: string): Promise<void>;
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

  async getCoupons(): Promise<Coupon[]> {
    return getMockCoupons();
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    return getMockCouponByCode(code);
  }

  async createCoupon(coupon: Omit<Coupon, 'id' | 'createdAt' | 'currentGlobalUses'>): Promise<Coupon> {
    return createMockCoupon(coupon);
  }

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    return updateMockCoupon(id, updates);
  }

  async deleteCoupon(id: string): Promise<void> {
    return deleteMockCoupon(id);
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

  async getCoupons(): Promise<Coupon[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return getMockCoupons();

    const { data, error } = await client.from('coupons').select('*').order('created_at', { ascending: false });
    if (error || !data) return getMockCoupons();
    
    // Map snake_case to camelCase
    return data.map((c: any) => ({
      id: c.id,
      code: c.code,
      description: c.description,
      discountType: c.discount_type,
      discountValue: c.discount_value,
      minOrderValue: c.min_order_value,
      maxGlobalUses: c.max_global_uses,
      currentGlobalUses: c.current_global_uses,
      maxUsesPerUser: c.max_uses_per_user,
      isActive: c.is_active,
      expiresAt: c.expires_at,
      createdAt: c.created_at,
    }));
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const client = getSupabaseBrowserClient();
    if (!client) return getMockCouponByCode(code);

    const { data, error } = await client.from('coupons').select('*').ilike('code', code).single();
    if (error || !data) return getMockCouponByCode(code);

    return {
      id: data.id,
      code: data.code,
      description: data.description,
      discountType: data.discount_type,
      discountValue: data.discount_value,
      minOrderValue: data.min_order_value,
      maxGlobalUses: data.max_global_uses,
      currentGlobalUses: data.current_global_uses,
      maxUsesPerUser: data.max_uses_per_user,
      isActive: data.is_active,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };
  }

  async createCoupon(coupon: Omit<Coupon, 'id' | 'createdAt' | 'currentGlobalUses'>): Promise<Coupon> {
    const client = getSupabaseBrowserClient();
    if (!client) return createMockCoupon(coupon);

    const insertData = {
      code: coupon.code.toUpperCase(),
      description: coupon.description,
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
      min_order_value: coupon.minOrderValue,
      max_global_uses: coupon.maxGlobalUses,
      max_uses_per_user: coupon.maxUsesPerUser,
      is_active: coupon.isActive,
      expires_at: coupon.expiresAt,
    };

    const { data, error } = await client.from('coupons').insert([insertData]).select().single();
    if (error || !data) return createMockCoupon(coupon);

    return {
      id: data.id,
      code: data.code,
      description: data.description,
      discountType: data.discount_type,
      discountValue: data.discount_value,
      minOrderValue: data.min_order_value,
      maxGlobalUses: data.max_global_uses,
      currentGlobalUses: data.current_global_uses,
      maxUsesPerUser: data.max_uses_per_user,
      isActive: data.is_active,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };
  }

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const client = getSupabaseBrowserClient();
    if (!client) return updateMockCoupon(id, updates);

    const updateData: any = {};
    if (updates.code !== undefined) updateData.code = updates.code.toUpperCase();
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.discountType !== undefined) updateData.discount_type = updates.discountType;
    if (updates.discountValue !== undefined) updateData.discount_value = updates.discountValue;
    if (updates.minOrderValue !== undefined) updateData.min_order_value = updates.minOrderValue;
    if (updates.maxGlobalUses !== undefined) updateData.max_global_uses = updates.maxGlobalUses;
    if (updates.maxUsesPerUser !== undefined) updateData.max_uses_per_user = updates.maxUsesPerUser;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.expiresAt !== undefined) updateData.expires_at = updates.expiresAt;
    if (updates.currentGlobalUses !== undefined) updateData.current_global_uses = updates.currentGlobalUses;

    const { data, error } = await client.from('coupons').update(updateData).eq('id', id).select().single();
    if (error || !data) return updateMockCoupon(id, updates);

    return {
      id: data.id,
      code: data.code,
      description: data.description,
      discountType: data.discount_type,
      discountValue: data.discount_value,
      minOrderValue: data.min_order_value,
      maxGlobalUses: data.max_global_uses,
      currentGlobalUses: data.current_global_uses,
      maxUsesPerUser: data.max_uses_per_user,
      isActive: data.is_active,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };
  }

  async deleteCoupon(id: string): Promise<void> {
    const client = getSupabaseBrowserClient();
    if (!client) return deleteMockCoupon(id);

    const { error } = await client.from('coupons').delete().eq('id', id);
    if (error) return deleteMockCoupon(id);
  }
}

export function getRepository(): DataRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseRepository();
  }
  return new DemoRepository();
}
