'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, Order, LicenseContract, ProductVariant } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/repositories/mock-data';
import { getOrderHistory } from '@/lib/orders/mock-checkout';

export interface AdminState {
  products: Product[];
  orders: Order[];
  contracts: LicenseContract[];
  syncOrdersFromStorage: () => void;
  addProduct: (data: {
    name: string;
    slug: string;
    description: string;
    brandId: string;
    categoryId: string;
    price: number;
    sku: string;
    stockQuantity: number;
    featuredImage: string;
  }) => Product;
  toggleProductStatus: (productId: string) => void;
  adjustVariantStock: (variantId: string, deltaAmount: number) => void;
  updateOrderStatus: (orderNumber: string, status: Order['status']) => void;
  addContract: (data: Omit<LicenseContract, 'id'>) => LicenseContract;
}

const DEFAULT_CONTRACTS: LicenseContract[] = [
  {
    id: 'contract-rbr-01',
    licenseHolderId: 'l1111111-1111-4111-8111-111111111111',
    holderName: 'Red Bull Technology Ltd',
    contractReference: 'RBR-2026-MERCH-01',
    royaltyRate: 12.5,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
  {
    id: 'contract-sf-01',
    licenseHolderId: 'l2222222-2222-4222-8222-222222222222',
    holderName: 'Ferrari S.p.A.',
    contractReference: 'SF-2026-MERCH-01',
    royaltyRate: 14.0,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
];

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      orders: [],
      contracts: DEFAULT_CONTRACTS,

      syncOrdersFromStorage: () => {
        const localHistory = getOrderHistory();
        const currentOrders = get().orders;
        const merged = [...currentOrders];

        localHistory.forEach((item) => {
          if (!merged.some((m) => m.orderNumber === item.orderNumber)) {
            merged.push(item);
          }
        });

        set({ orders: merged });
      },

      addProduct: (data) => {
        const newId = `prod-${Date.now()}`;
        const newVariant: ProductVariant = {
          id: `var-${Date.now()}`,
          productId: newId,
          sku: data.sku,
          size: 'ONE SIZE',
          price: data.price,
          stockQuantity: data.stockQuantity,
          lowStockThreshold: 3,
          isActive: true,
        };

        const newProduct: Product = {
          id: newId,
          brandId: data.brandId,
          categoryId: data.categoryId,
          name: data.name,
          slug: data.slug,
          description: data.description,
          status: 'active',
          isPreorder: false,
          minPrice: data.price,
          maxPrice: data.price,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          variants: [newVariant],
          images: [],
          featuredImage: data.featuredImage || '/products/polo-navy.jpg',
        };

        set({ products: [newProduct, ...get().products] });
        return newProduct;
      },

      toggleProductStatus: (productId) => {
        set({
          products: get().products.map((p) => {
            if (p.id !== productId) return p;
            const nextStatus = p.status === 'active' ? 'draft' : 'active';
            return { ...p, status: nextStatus };
          }),
        });
      },

      adjustVariantStock: (variantId, deltaAmount) => {
        set({
          products: get().products.map((prod) => ({
            ...prod,
            variants: prod.variants.map((v) => {
              if (v.id !== variantId) return v;
              const newQty = Math.max(0, v.stockQuantity + deltaAmount);
              return { ...v, stockQuantity: newQty };
            }),
          })),
        });
      },

      updateOrderStatus: (orderNumber, status) => {
        set({
          orders: get().orders.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o)),
        });
      },

      addContract: (data) => {
        const newContract: LicenseContract = {
          ...data,
          id: `contract-${Date.now()}`,
        };
        set({ contracts: [newContract, ...get().contracts] });
        return newContract;
      },
    }),
    {
      name: 'allthingsmerch-admin',
    }
  )
);
