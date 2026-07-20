import { Product, Brand, Category, ProductStatus, ProductVariant, ProductImage } from '@/types';
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
      .select('*, brands(*), categories(*), product_variants(*), product_images(*)')
      .eq('status', 'active');

    if (error || !data) {
      console.warn('Supabase fetch failed, falling back to Demo mode', error);
      return getMockProducts();
    }

    return data.map(mapSupabaseRowToProduct);
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

    return mapSupabaseRowToProduct(data);
  }

  async getBrands(): Promise<Brand[]> {
    const client = getSupabaseBrowserClient();
    if (!client) return MOCK_BRANDS;

    const { data, error } = await client.from('brands').select('*').eq('is_active', true);
    if (error || !data) return MOCK_BRANDS;
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
    if (!client) return MOCK_CATEGORIES;

    const { data, error } = await client.from('categories').select('*');
    if (error || !data) return MOCK_CATEGORIES;
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentId: c.parent_id ?? undefined,
    }));
  }
}

export function getRepository(): DataRepository {
  if (isSupabaseConfigured()) {
    return new SupabaseRepository();
  }
  return new DemoRepository();
}
