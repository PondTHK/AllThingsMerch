export type UserRole = 'customer' | 'admin' | 'license_holder';

export type ProductStatus = 'draft' | 'active' | 'archived';

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxGlobalUses?: number;
  currentGlobalUses: number;
  maxUsesPerUser?: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

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

export interface CartItem {
  id: string; // unique cart line id
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  sku: string;
  size?: string;
  color?: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  brandName?: string;
  isPreorder?: boolean;
  preorderReleaseAt?: string;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  sku: string;
  size?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  authenticityTagCode?: string;
  serialNumber?: string;
  royaltyRateSnapshot: number; // percentage e.g. 12.5
  licenseContractId?: string;
  isPreorder?: boolean;
  preorderReleaseAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount?: number;
  couponCode?: string;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  isDemoOrder: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface SavedAddress extends ShippingAddress {
  id: string;
  label: string;
  isDefault: boolean;
}

export interface LicenseHolder {
  id: string;
  name: string;
  contactEmail: string;
  status: 'active' | 'suspended';
}

export interface LicenseContract {
  id: string;
  licenseHolderId: string;
  holderName: string;
  contractReference: string;
  royaltyRate: number; // percentage e.g. 12.5
  startsAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'suspended';
}

export interface AuthenticityTagRecord {
  tagCode: string; // e.g. 'DEMO-TAG-2026' or 'ATM-2026-F1-8819A'
  serialNumber: string; // e.g. 'SN-RBR-00001'
  productId: string;
  productName: string;
  brandName: string;
  sku: string;
  size?: string;
  status: 'active' | 'flagged' | 'revoked';
  issuedAt: string;
  orderNumber?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderItemId: string;
  rating: number; // 1-5
  comment: string;
  status: 'pending' | 'published' | 'hidden';
  createdAt: string;
  userName?: string;
  productName?: string;
}



