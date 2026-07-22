'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, Coupon } from '@/types';
import { useAdminStore } from '@/lib/admin/useAdminStore';
import { useAuthStore } from '@/lib/auth/useAuthStore';

const RESERVATION_MS = 15 * 60 * 1000; // 15 minutes

/** Compute the soonest reservedUntil from a list of items, or null if none. */
function computeCartReservedUntil(items: CartItem[]): string | null {
  const timestamps = items
    .map((i) => i.reservedUntil)
    .filter((t): t is string => !!t);
  if (timestamps.length === 0) return null;
  return timestamps.reduce((min, t) => (t < min ? t : min));
}

interface CartState {
  items: CartItem[];
  cartReservedUntil: string | null;
  appliedCoupon: Coupon | null;
  addItem: (variant: ProductVariant, product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearCartWithoutRelease: () => Promise<void>;
  /**
   * Releases stock for each expired item individually and removes them from the
   * cart. Non-expired items are kept intact.
   * Call this on page load / focus to clean up stale reservations.
   */
  releaseExpiredReservation: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getDiscountAmount: () => number;
  getTotalAmount: () => number;
  syncWithDb: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      cartReservedUntil: null,
      appliedCoupon: null,

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      addItem: async (variant, product, quantity = 1) => {
        const adminProducts = useAdminStore.getState().products;
        const adminProduct = adminProducts.find(p => p.id === product.id);
        const adminVariant = adminProduct?.variants.find(v => v.id === variant.id);
        const availableStock = adminVariant ? adminVariant.stockQuantity : (variant.stockQuantity ?? Infinity);

        if (availableStock < quantity) {
          throw new Error(`Insufficient stock. Only ${availableStock} item(s) left.`);
        }

        const existingItems = get().items;

        if (product.isLimited) {
          useAdminStore.getState().adjustVariantStock(
            variant.id,
            -quantity,
            'reserve',
            'cart',
            undefined,
            `Cart reservation lock for ${product.name} (Qty: ${quantity})`
          );
        }

        const reservedUntil = product.isLimited
          ? new Date(Date.now() + RESERVATION_MS).toISOString()
          : undefined;
        const existingIndex = existingItems.findIndex(
          (item) => item.variantId === variant.id
        );

        let nextItems: CartItem[];
        if (existingIndex > -1) {
          nextItems = existingItems.map((item, i) =>
            i === existingIndex
              ? { ...item, quantity: item.quantity + quantity, stockQuantity: variant.stockQuantity ?? item.stockQuantity, reservedUntil }
              : item
          );
        } else {
          const newItem: CartItem = {
            id: `${variant.id}-${Date.now()}`,
            productId: product.id,
            variantId: variant.id,
            productName: product.name,
            productSlug: product.slug,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            unitPrice: variant.price,
            quantity,
            stockQuantity: variant.stockQuantity,
            imageUrl: product.featuredImage,
            brandName: product.brand?.name || 'AllThingsMerch',
            isPreorder: product.isPreorder,
            preorderReleaseAt: product.preorderReleaseAt,
            isLimited: product.isLimited,
            reservedUntil,
          };
          nextItems = [...existingItems, newItem];
        }

        set({
          items: nextItems,
          cartReservedUntil: computeCartReservedUntil(nextItems),
        });

        // Sync to DB if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const { addToDbCartAction } = await import('@/app/cart/actions');
            const targetItem = nextItems.find(i => i.variantId === variant.id);
            if (targetItem) {
              await addToDbCartAction(variant.id, targetItem.quantity, reservedUntil);
              await get().syncWithDb();
            }
          } catch (err) {
            console.error('Failed to sync addItem to DB:', err);
          }
        }
      },

      updateQuantity: async (variantId, quantity) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (!item) return;

        const diff = quantity - item.quantity;
        if (diff === 0) return;

        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }

        // Extend or shrink reservation for limited items
        const reservedUntil = item.isLimited
          ? new Date(Date.now() + RESERVATION_MS).toISOString()
          : undefined;

        if (diff > 0) {
          const adminProducts = useAdminStore.getState().products;
          const adminVariant = adminProducts
            .flatMap((p) => p.variants)
            .find((v) => v.id === variantId);
          const availableStock = adminVariant ? adminVariant.stockQuantity : (item.stockQuantity ?? Infinity);

          if (availableStock < diff) {
            throw new Error(`Insufficient stock. Only ${availableStock} additional item(s) left.`);
          }

          if (item.isLimited) {
            useAdminStore.getState().adjustVariantStock(
              variantId,
              -diff,
              'reserve',
              'cart',
              undefined,
              `Extended cart reservation lock (Qty: +${diff})`
            );
          }
        } else {
          if (item.isLimited) {
            useAdminStore.getState().adjustVariantStock(
              variantId,
              Math.abs(diff),
              'release',
              'cart',
              undefined,
              `Reduced cart reservation lock (Qty: ${diff})`
            );
          }
        }

        const nextItems = get().items.map((i) =>
          i.variantId === variantId ? { ...i, quantity, reservedUntil } : i
        );

        set({
          items: nextItems,
          cartReservedUntil: computeCartReservedUntil(nextItems),
        });

        // Sync to DB if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const { updateDbCartQuantityAction } = await import('@/app/cart/actions');
            await updateDbCartQuantityAction(variantId, quantity);
            await get().syncWithDb();
          } catch (err) {
            console.error('Failed to sync updateQuantity to DB:', err);
          }
        }
      },

      removeItem: async (variantId) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (item && item.isLimited) {
          useAdminStore.getState().adjustVariantStock(
            variantId,
            item.quantity,
            'release',
            'cart',
            undefined,
            `Cart item removed ${item.productName}`
          );
        }
        const nextItems = get().items.filter((item) => item.variantId !== variantId);
        set({
          items: nextItems,
          cartReservedUntil: computeCartReservedUntil(nextItems),
        });

        // Sync to DB if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const { removeFromDbCartAction } = await import('@/app/cart/actions');
            await removeFromDbCartAction(variantId);
            await get().syncWithDb();
          } catch (err) {
            console.error('Failed to sync removeItem to DB:', err);
          }
        }
      },

      clearCart: async () => {
        const { items } = get();
        items.forEach((item) => {
          if (item.isLimited) {
            useAdminStore.getState().adjustVariantStock(
              item.variantId,
              item.quantity,
              'release',
              'cart',
              undefined,
              `Cart cleared ${item.productName}`
            );
          }
        });
        set({ items: [], appliedCoupon: null, cartReservedUntil: null });

        // Sync to DB if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const { clearDbCartAction } = await import('@/app/cart/actions');
            await clearDbCartAction();
            await get().syncWithDb();
          } catch (err) {
            console.error('Failed to sync clearCart to DB:', err);
          }
        }
      },

      clearCartWithoutRelease: async () => {
        set({ items: [], appliedCoupon: null, cartReservedUntil: null });
        
        // Sync to DB if logged in
        const user = useAuthStore.getState().user;
        if (user) {
          try {
            const { clearDbCartAction } = await import('@/app/cart/actions');
            await clearDbCartAction();
          } catch (err) {
            console.error('Failed to clear DB cart without release:', err);
          }
        }
      },

      syncWithDb: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        try {
          const { getDbCartAction } = await import('@/app/cart/actions');
          const dbItems = await getDbCartAction();
          set({
            items: dbItems,
            cartReservedUntil: computeCartReservedUntil(dbItems),
          });
        } catch (err) {
          console.error('Failed to syncWithDb:', err);
        }
      },

      /**
       * Per-item expiry: only releases and removes items whose reservedUntil
       * has passed. Items still within their window are untouched.
       *
       * For items persisted before reservedUntil was added (undefined), we fall
       * back to the cart-level cartReservedUntil. If that is also undefined the
       * item is considered non-expiring and is kept.
       */
      releaseExpiredReservation: () => {
        const now = Date.now();
        const cartExpiry = get().cartReservedUntil;

        const { expiredItems, validItems } = get().items.reduce(
          (acc, item) => {
            const expiry = item.reservedUntil ?? cartExpiry ?? null;
            if (expiry && new Date(expiry).getTime() < now) {
              acc.expiredItems.push(item);
            } else {
              acc.validItems.push(item);
            }
            return acc;
          },
          { expiredItems: [] as CartItem[], validItems: [] as CartItem[] }
        );

        if (expiredItems.length === 0) return;

        expiredItems.forEach((item) => {
          useAdminStore.getState().adjustVariantStock(
            item.variantId,
            item.quantity,
            'release',
            'cart',
            undefined,
            `Cart reservation expired for ${item.productName}`
          );
        });

        set({
          items: validItems,
          cartReservedUntil: computeCartReservedUntil(validItems),
          // Clear coupon only if cart is now completely empty
          appliedCoupon: validItems.length === 0 ? null : get().appliedCoupon,
        });
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 3000) return 0;
        return 100;
      },

      getDiscountAmount: () => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;

        const subtotal = get().getSubtotal();

        // Check minimum order value
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
          return 0;
        }

        if (coupon.discountType === 'percentage') {
          return Math.floor(subtotal * (coupon.discountValue / 100));
        } else {
          return Math.min(subtotal, coupon.discountValue);
        }
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount) + shipping;
      },
    }),
    {
      name: 'allthingsmerch-cart',
    }
  )
);
