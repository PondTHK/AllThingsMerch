export type UserRole = 'customer' | 'admin' | 'license_holder';

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  productId: string;
  storagePath: string;
  altText: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  brandId: string;
  categoryId: string;
  licenseContractId?: string;
  name: string;
  slug: string;
  description: string;
  status: ProductStatus;
  isPreorder: boolean;
  preorderReleaseAt?: string;
  createdAt: string;
  updatedAt: string;
  // Joined convenience fields for UI display
  brand?: Brand;
  category?: Category;
  variants: ProductVariant[];
  images: ProductImage[];
  featuredImage: string;
  minPrice: number;
  maxPrice: number;
  tagline?: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  itemCount: number;
}
