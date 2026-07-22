import { Product, Brand, Category, ProductStatus, ProductVariant, ProductImage, Coupon } from '@/types';
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

function mapSupabaseRowToProduct(row: any): Product {
  const variants: ProductVariant[] = (row.product_variants ?? []).map((v: any) => ({
    id: v.id,
    productId: v.product_id ?? row.id,
    sku: v.sku ?? '',
    size: v.size ?? undefined,
    color: v.color ?? undefined,
    price: Number(v.price) || 0,
    compareAtPrice: v.compare_at_price != null ? Number(v.compare_at_price) : undefined,
    stockQuantity: Number(v.stock_quantity) || 0,
    lowStockThreshold: Number(v.low_stock_threshold) || 3,
    isActive: v.is_active ?? true,
  }));

  const images: ProductImage[] = (row.product_images ?? []).map((img: any) => ({
    id: img.id,
    productId: img.product_id ?? row.id,
    storagePath: img.storage_path ?? '',
    altText: img.alt_text ?? '',
    sortOrder: Number(img.sort_order) || 0,
  }));

  const prices = variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const brandObj: Brand | undefined = row.brands
    ? {
        id: row.brands.id,
        name: row.brands.name,
        slug: row.brands.slug,
        description: row.brands.description ?? undefined,
        logoUrl: row.brands.logo_url ?? undefined,
        isActive: row.brands.is_active ?? true,
      }
    : undefined;

  const catObj: Category | undefined = row.categories
    ? {
        id: row.categories.id,
        name: row.categories.name,
        slug: row.categories.slug,
        parentId: row.categories.parent_id ?? undefined,
      }
    : undefined;

  const featuredImage =
    images.length > 0 ? images[0].storagePath : '/favicon.ico';

  return {
    id: row.id,
    brandId: row.brand_id ?? '',
    categoryId: row.category_id ?? '',
    licenseContractId: row.license_contract_id ?? undefined,
    name: row.name ?? '',
    slug: row.slug ?? '',
    description: row.description ?? '',
    status: (row.status ?? 'draft') as ProductStatus,
    isPreorder: row.is_preorder ?? false,
    preorderReleaseAt: row.preorder_release_at ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
    updatedAt: row.updated_at ?? new Date().toISOString(),
    brand: brandObj,
    category: catObj,
    variants,
    images,
    featuredImage,
    minPrice,
    maxPrice,
    tagline: row.tagline ?? undefined,
  };
}

function mapSupabaseRowToCoupon(row: any): Coupon {
  return {
    id: row.id,
    code: row.code ?? '',
    description: row.description ?? undefined,
    discountType: (row.discount_type ?? 'fixed') as 'percentage' | 'fixed',
    discountValue: Number(row.discount_value) || 0,
    minOrderValue: row.minimum_order_amount != null ? Number(row.minimum_order_amount) : (row.min_order_value != null ? Number(row.min_order_value) : undefined),
    maxGlobalUses: row.usage_limit != null ? Number(row.usage_limit) : (row.max_global_uses != null ? Number(row.max_global_uses) : undefined),
    currentGlobalUses: row.usage_count != null ? Number(row.usage_count) : (row.current_global_uses != null ? Number(row.current_global_uses) : 0),
    maxUsesPerUser: row.max_uses_per_user != null ? Number(row.max_uses_per_user) : undefined,
    isActive: row.is_active ?? true,
    expiresAt: row.expires_at ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
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
    if (!client) {
      console.error('Supabase client not configured.');
      return [];
    }

    const { data, error } = await client
      .from('products')
      .select('*, brands(*), categories(*), product_variants(*), product_images(*)')
      .eq('status', 'active');

    if (error || !data) {
      console.error('Supabase getProducts error:', error);
      return [];
    }

    return data.map(mapSupabaseRowToProduct);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      console.error('Supabase client not configured.');
      return undefined;
    }

    const { data, error } = await client
      .from('products')
      .select('*, brands(*), categories(*), product_variants(*), product_images(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Supabase getProductBySlug error:', error);
      return undefined;
    }

    return mapSupabaseRowToProduct(data);
  }

  async getBrands(): Promise<Brand[]> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      console.error('Supabase client not configured.');
      return [];
    }

    const { data, error } = await client.from('brands').select('*').eq('is_active', true);
    if (error || !data) {
      console.error('Supabase getBrands error:', error);
      return [];
    }
    return data.map((b: any) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      description: b.description ?? undefined,
      logoUrl: b.logo_url ?? undefined,
      isActive: b.is_active ?? true,
    }));
  }

  async getCategories(): Promise<Category[]> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      console.error('Supabase client not configured.');
      return [];
    }

    const { data, error } = await client.from('categories').select('*');
    if (error || !data) {
      console.error('Supabase getCategories error:', error);
      return [];
    }
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentId: c.parent_id ?? undefined,
    }));
  }

  async getCoupons(): Promise<Coupon[]> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      console.error('Supabase client not configured.');
      return [];
    }

    const { data, error } = await client
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.error('Supabase getCoupons error:', error);
      return [];
    }

    return data.map(mapSupabaseRowToCoupon);
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const client = getSupabaseBrowserClient();
    if (!client) {
      console.error('Supabase client not configured.');
      return undefined;
    }

    const { data, error } = await client
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .maybeSingle();

    if (error || !data) {
      return undefined;
    }

    return mapSupabaseRowToCoupon(data);
  }

  async createCoupon(coupon: Omit<Coupon, 'id' | 'createdAt' | 'currentGlobalUses'>): Promise<Coupon> {
    const client = getSupabaseBrowserClient();
    if (!client) throw new Error('Supabase client not configured.');

    const dbCoupon = {
      code: coupon.code,
      description: coupon.description ?? null,
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
      minimum_order_amount: coupon.minOrderValue ?? null,
      usage_limit: coupon.maxGlobalUses ?? null,
      usage_count: 0,
      is_active: coupon.isActive ?? true,
      starts_at: new Date().toISOString(),
      expires_at: coupon.expiresAt ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { data, error } = await client
      .from('coupons')
      .insert([dbCoupon])
      .select()
      .single();

    if (error || !data) {
      console.error('Failed to create coupon in Supabase:', error);
      throw error || new Error('Failed to create coupon');
    }

    return mapSupabaseRowToCoupon(data);
  }

  async updateCoupon(id: string, updates: Partial<Coupon>): Promise<Coupon> {
    const client = getSupabaseBrowserClient();
    if (!client) throw new Error('Supabase client not configured.');

    const dbUpdates: any = {};
    if (updates.code !== undefined) dbUpdates.code = updates.code;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.discountType !== undefined) dbUpdates.discount_type = updates.discountType;
    if (updates.discountValue !== undefined) dbUpdates.discount_value = updates.discountValue;
    if (updates.minOrderValue !== undefined) dbUpdates.minimum_order_amount = updates.minOrderValue;
    if (updates.maxGlobalUses !== undefined) dbUpdates.usage_limit = updates.maxGlobalUses;
    if (updates.currentGlobalUses !== undefined) dbUpdates.usage_count = updates.currentGlobalUses;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
    if (updates.expiresAt !== undefined) dbUpdates.expires_at = updates.expiresAt;
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await client
      .from('coupons')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Failed to update coupon in Supabase:', error);
      throw error || new Error('Failed to update coupon');
    }

    return mapSupabaseRowToCoupon(data);
  }

  async deleteCoupon(id: string): Promise<void> {
    const client = getSupabaseBrowserClient();
    if (!client) throw new Error('Supabase client not configured.');

    const { error } = await client.from('coupons').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete coupon in Supabase:', error);
      throw error;
    }
  }
}

export function getRepository(): DataRepository {
  return new SupabaseRepository();
}
