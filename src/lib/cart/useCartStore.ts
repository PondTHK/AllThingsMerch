import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, ProductVariant } from '@/types';

interface CartState {
  items: CartItem[];
  addItem: (variant: ProductVariant, product: Product, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

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
        set({ items: [] });
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

      getTotalAmount: () => {
        return get().getSubtotal() + get().getShippingFee();
      },
    }),
    {
      name: 'allthingsmerch-cart',
    }
  )
);
