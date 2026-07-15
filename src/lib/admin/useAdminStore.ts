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
    holderName: 'Oracle Red Bull Racing',
    contractReference: 'RBR-2026-MERCH-01',
    royaltyRate: 12.5,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
  {
    id: 'contract-sf-01',
    licenseHolderId: 'l2222222-2222-4222-8222-222222222222',
    holderName: 'Scuderia Ferrari F1',
    contractReference: 'SF-2026-MERCH-01',
    royaltyRate: 14.0,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
  {
    id: 'contract-travis-01',
    licenseHolderId: 'l3333333-3333-4333-8333-333333333333',
    holderName: 'Cactus Jack Merch',
    contractReference: 'CJ-2026-TOUR-01',
    royaltyRate: 10.0,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
  {
    id: 'contract-weeknd-01',
    licenseHolderId: 'l4444444-4444-4444-8444-444444444444',
    holderName: 'XO Records',
    contractReference: 'XO-2026-ALBUM-01',
    royaltyRate: 10.0,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
  {
    id: 'contract-real-01',
    licenseHolderId: 'l5555555-5555-4555-8555-555555555555',
    holderName: 'Real Madrid Official',
    contractReference: 'RM-2026-CLUB-01',
    royaltyRate: 15.0,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
  {
    id: 'contract-arsenal-01',
    licenseHolderId: 'l6666666-6666-4666-8666-666666666666',
    holderName: 'Arsenal FC',
    contractReference: 'AFC-2026-CLUB-01',
    royaltyRate: 15.0,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
  {
    id: 'contract-kaws-01',
    licenseHolderId: 'l7777777-7777-4777-8777-777777777777',
    holderName: 'KAWS Collectibles',
    contractReference: 'KAWS-2026-ART-01',
    royaltyRate: 8.0,
    startsAt: '2026-01-01',
    expiresAt: '2027-12-31',
    status: 'active',
  },
  {
    id: 'contract-bearbrick-01',
    licenseHolderId: 'l8888888-8888-4888-8888-888888888888',
    holderName: 'Bearbrick Collectibles',
    contractReference: 'MED-2026-TOY-01',
    royaltyRate: 8.0,
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
