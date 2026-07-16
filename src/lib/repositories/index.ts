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

interface DbVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string | null;
  color: string | null;
  price: string | number;
  compare_at_price: string | number | null;
  stock_quantity: number;
  low_stock_threshold: number | null;
  is_active: boolean;
  created_at: string;
}

interface DbImage {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
}

interface DbBrand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  is_active: boolean;
}

interface DbCategory {
  id: string;
  name: string;
  slug: string;
}

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand_id: string;
  category_id: string;
  license_contract_id: string | null;
  status: string;
  is_preorder: boolean;
  preorder_release_at: string | null;
  created_at: string;
  updated_at: string;
  product_variants?: DbVariant[];
  product_images?: DbImage[];
  brands?: DbBrand | null;
  categories?: DbCategory | null;
}

interface DbCoupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_value: number | null;
  max_global_uses: number | null;
  current_global_uses: number;
  max_uses_per_user: number | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

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

function mapDbProductToProduct(p: DbProduct): Product {
  const variants: ProductVariant[] = (p.product_variants || []).map((v: DbVariant) => ({
    id: v.id,
    productId: v.product_id,
    sku: v.sku,
    size: v.size || undefined,
    color: v.color || undefined,
    price: Number(v.price),
    compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
    stockQuantity: v.stock_quantity,
    lowStockThreshold: v.low_stock_threshold !== null ? v.low_stock_threshold : 10,
    isActive: v.is_active,
  }));

  const prices = variants.map((v) => v.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const images: ProductImage[] = (p.product_images || []).map((img: DbImage) => ({
    id: img.id,
    productId: img.product_id,
    storagePath: img.storage_path,
    altText: img.alt_text || '',
    sortOrder: img.sort_order,
  })).sort((a, b) => a.sortOrder - b.sortOrder);

  const featuredImage = images.length > 0 ? images[0].storagePath : '/products/polo-navy.jpg';

  let tagline = undefined;
  if (p.is_preorder) {
    const releaseDate = p.preorder_release_at ? new Date(p.preorder_release_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
    tagline = `Pre-Order Drop${releaseDate ? ` • Releases ${releaseDate}` : ''}`;
  }

  return {
    id: p.id,
    brandId: p.brand_id,
    categoryId: p.category_id,
    licenseContractId: p.license_contract_id || undefined,
    name: p.name,
    slug: p.slug,
    description: p.description || '',
    status: p.status as ProductStatus,
    isPreorder: p.is_preorder || false,
    preorderReleaseAt: p.preorder_release_at || undefined,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    brand: p.brands ? {
      id: p.brands.id,
      name: p.brands.name,
      slug: p.brands.slug,
      logoUrl: p.brands.logo_url || '',
      description: p.brands.description || '',
      isActive: p.brands.is_active,
    } : undefined,
    category: p.categories ? {
      id: p.categories.id,
      name: p.categories.name,
      slug: p.categories.slug,
    } : undefined,
    variants,
    images,
    featuredImage,
    minPrice,
    maxPrice,
    tagline,
  };
}

class SupabaseRepository implements DataRepository {
  mode = 'supabase' as const;

  async getProducts(): Promise<Product[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return getMockProducts();

    const { data, error } = await client
      .from('products')
      .select('*, brands(*), categories(*), product_variants(*), product_images(*)')
      .eq('status', 'active');

    if (error || !data) {
      console.warn('Supabase fetch failed, falling back to Demo mode', error);
      return getMockProducts();
    }

    return data.map(mapDbProductToProduct);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const client = getSupabaseBrowserClient();
    if (!client) return getMockProductBySlug(slug);

    const { data, error } = await client
      .from('products')
      .select('*, brands(*), categories(*), product_variants(*), product_images(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return getMockProductBySlug(slug);
    }

    return mapDbProductToProduct(data);
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
    return data.map((c: DbCoupon) => ({
      id: c.id,
      code: c.code,
      description: c.description || undefined,
      discountType: c.discount_type,
      discountValue: Number(c.discount_value),
      minOrderValue: c.min_order_value ? Number(c.min_order_value) : undefined,
      maxGlobalUses: c.max_global_uses !== null ? c.max_global_uses : undefined,
      currentGlobalUses: c.current_global_uses,
      maxUsesPerUser: c.max_uses_per_user !== null ? c.max_uses_per_user : undefined,
      isActive: c.is_active,
      expiresAt: c.expires_at || undefined,
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

    const updateData: Record<string, unknown> = {};
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
