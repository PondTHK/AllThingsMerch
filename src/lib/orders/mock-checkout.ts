import { CartItem, Order, OrderItem, ShippingAddress } from '@/types';
import { getProductBySlug } from '@/lib/repositories/mock-data';

// Server-side / adapter price verification: ensures prices match official catalog
export function validateAndRecalculateCart(items: CartItem[]): {
  verifiedItems: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  isValid: boolean;
  errorMessage?: string;
} {
  if (!items || items.length === 0) {
    return {
      verifiedItems: [],
      subtotal: 0,
      shippingFee: 0,
      totalAmount: 0,
      isValid: false,
      errorMessage: 'Cart is empty',
    };
  }

  const verifiedItems: OrderItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = getProductBySlug(item.productSlug);
    if (!product) {
      return {
        verifiedItems: [],
        subtotal: 0,
        shippingFee: 0,
        totalAmount: 0,
        isValid: false,
        errorMessage: `Product "${item.productName}" is no longer available.`,
      };
    }

    const variant = product.variants.find((v) => v.id === item.variantId);
    if (!variant) {
      return {
        verifiedItems: [],
        subtotal: 0,
        shippingFee: 0,
        totalAmount: 0,
        isValid: false,
        errorMessage: `Selected variant for "${item.productName}" is no longer available.`,
      };
    }

    const officialPrice = variant.price;
    const lineTotal = officialPrice * item.quantity;
    subtotal += lineTotal;

    verifiedItems.push({
      id: `order-item-${Math.random().toString(36).substring(2, 9)}`,
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      sku: variant.sku,
      size: variant.size,
      unitPrice: officialPrice,
      quantity: item.quantity,
      totalPrice: lineTotal,
    });
  }

  const shippingFee = subtotal >= 3000 ? 0 : 100;
  const totalAmount = subtotal + shippingFee;

  return {
    verifiedItems,
    subtotal,
    shippingFee,
    totalAmount,
    isValid: true,
  };
}

// Generate an official demo Order with Authenticity TAG assignment
export function fulfillMockOrder(
  items: CartItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string
): Order {
  const calculation = validateAndRecalculateCart(items);
  if (!calculation.isValid) {
    throw new Error(calculation.errorMessage || 'Invalid checkout calculation');
  }

  const orderNumber = `ATM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Assign 1-to-1 Authenticity TAG codes for each fulfilled item
  const fulfilledItems: OrderItem[] = calculation.verifiedItems.map((item, index) => {
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    return {
      ...item,
      authenticityTagCode: `TAG-${orderNumber}-${index + 1}-${randomHex}`,
      serialNumber: `SN-${item.sku}-${randomHex}`,
    };
  });

  const order: Order = {
    id: `ord-${Date.now()}`,
    orderNumber,
    status: 'fulfilled',
    items: fulfilledItems,
    subtotal: calculation.subtotal,
    shippingFee: calculation.shippingFee,
    totalAmount: calculation.totalAmount,
    shippingAddress,
    paymentMethod,
    isDemoOrder: true,
    createdAt: new Date().toISOString(),
  };

  // Persist order history locally for Demo Mode
  if (typeof window !== 'undefined') {
    try {
      const existingHistoryRaw = localStorage.getItem('allthingsmerch-orders');
      const existingHistory: Order[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
      localStorage.setItem('allthingsmerch-orders', JSON.stringify([order, ...existingHistory]));
    } catch (e) {
      console.error('Failed to save order to localStorage', e);
    }
  }

  return order;
}

export function getOrderHistory(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('allthingsmerch-orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
