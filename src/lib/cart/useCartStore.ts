import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant, Coupon } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (variant: ProductVariant, product: Product, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
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
      appliedCoupon: null,

      applyCoupon: (coupon) => {
        set({ appliedCoupon: coupon });
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      addItem: (variant, product, quantity = 1) => {
        const existingItems = get().items;
        const existingIndex = existingItems.findIndex(
          (item) => item.variantId === variant.id
        );

        if (existingIndex > -1) {
          const updated = [...existingItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          set({ items: updated });
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
          set({ items: [...existingItems, newItem] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null });
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
