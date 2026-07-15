import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, Coupon } from '@/types';
import { useAdminStore } from '@/lib/admin/useAdminStore';

interface CartState {
  items: CartItem[];
  cartReservedUntil: string | null;
  addItem: (variant: ProductVariant, product: Product, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  clearCartWithoutRelease: () => void;
  releaseExpiredReservation: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getDiscountAmount: () => number;
  getTotalAmount: () => number;
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

      addItem: (variant, product, quantity = 1) => {
        const adminProducts = useAdminStore.getState().products;
        const adminProduct = adminProducts.find(p => p.id === product.id);
        const adminVariant = adminProduct?.variants.find(v => v.id === variant.id);
        const availableStock = adminVariant ? adminVariant.stockQuantity : 0;

        if (availableStock < quantity) {
          throw new Error(`Insufficient stock. Only ${availableStock} item(s) left.`);
        }

        const existingItems = get().items;

        if (existingItems.length > 0) {
          const cartIsPreorder = existingItems[0].isPreorder || false;
          const incomingIsPreorder = product.isPreorder || false;
          if (cartIsPreorder !== incomingIsPreorder) {
            throw new Error(
              incomingIsPreorder
                ? 'Cannot add a pre-order item to a cart containing in-stock items.'
                : 'Cannot add an in-stock item to a cart containing pre-order items.'
            );
          }
        }

        useAdminStore.getState().adjustVariantStock(
          variant.id,
          -quantity,
          'reserve',
          'cart',
          undefined,
          `Cart reservation lock for ${product.name} (Qty: ${quantity})`
        );

        const reservationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        const existingIndex = existingItems.findIndex(
          (item) => item.variantId === variant.id
        );

        if (existingIndex > -1) {
          const updated = [...existingItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          set({ items: updated, cartReservedUntil: reservationTime });
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
            imageUrl: product.featuredImage,
            brandName: product.brand?.name || 'AllThingsMerch',
            isPreorder: product.isPreorder,
            preorderReleaseAt: product.preorderReleaseAt,
          };
          set({ items: [...existingItems, newItem], cartReservedUntil: reservationTime });
        }
      },

      updateQuantity: (variantId, quantity) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (!item) return;

        const diff = quantity - item.quantity;
        if (diff === 0) return;

        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        if (diff > 0) {
          const adminProducts = useAdminStore.getState().products;
          const adminVariant = adminProducts
            .flatMap((p) => p.variants)
            .find((v) => v.id === variantId);
          const availableStock = adminVariant ? adminVariant.stockQuantity : 0;

          if (availableStock < diff) {
            throw new Error(`Insufficient stock. Only ${availableStock} additional item(s) left.`);
          }

          useAdminStore.getState().adjustVariantStock(
            variantId,
            -diff,
            'reserve',
            'cart',
            undefined,
            `Cart reservation increased by ${diff}`
          );
        } else {
          useAdminStore.getState().adjustVariantStock(
            variantId,
            -diff,
            'release',
            'cart',
            undefined,
            `Cart reservation decreased by ${Math.abs(diff)}`
          );
        }

        const reservationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
          cartReservedUntil: reservationTime,
        });
      },

      removeItem: (variantId) => {
        const item = get().items.find((i) => i.variantId === variantId);
        if (item) {
          useAdminStore.getState().adjustVariantStock(
            variantId,
            item.quantity,
            'release',
            'cart',
            undefined,
            `Cart reservation released (Item removed)`
          );
        }

        const nextItems = get().items.filter((item) => item.variantId !== variantId);
        const reservationTime = nextItems.length > 0 
          ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
          : null;

        set({
          items: nextItems,
          cartReservedUntil: reservationTime,
        });
      },

      clearCart: () => {
        get().items.forEach((item) => {
          useAdminStore.getState().adjustVariantStock(
            item.variantId,
            item.quantity,
            'release',
            'cart',
            undefined,
            `Cart reservation released (Cart cleared)`
          );
        });
        set({ items: [], appliedCoupon: null, cartReservedUntil: null });
      },

      clearCartWithoutRelease: () => {
        set({ items: [], appliedCoupon: null, cartReservedUntil: null });
      },

      releaseExpiredReservation: () => {
        const reservedUntil = get().cartReservedUntil;
        if (reservedUntil && new Date().getTime() > new Date(reservedUntil).getTime()) {
          get().items.forEach((item) => {
            useAdminStore.getState().adjustVariantStock(
              item.variantId,
              item.quantity,
              'release',
              'cart',
              undefined,
              `Cart reservation expired for ${item.productName}`
            );
          });
          set({ items: [], appliedCoupon: null, cartReservedUntil: null });
        }
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
          return 0; // Or we could automatically remove it, but returning 0 is safer for state
        }

        if (coupon.discountType === 'percentage') {
          return Math.floor(subtotal * (coupon.discountValue / 100));
        } else {
          return Math.min(subtotal, coupon.discountValue); // Discount shouldn't exceed subtotal
        }
      },

      getTotalAmount: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        
        // Discount is applied before shipping in most ecommerce logic
        return Math.max(0, subtotal - discount) + shipping;
      },
    }),
    {
      name: 'allthingsmerch-cart',
    }
  )
);
