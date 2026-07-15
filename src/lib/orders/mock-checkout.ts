import { CartItem, Order, OrderItem, ShippingAddress, Coupon } from '@/types';
import { getProductBySlug } from '@/lib/repositories/mock-data';
import { useAdminStore } from '@/lib/admin/useAdminStore';

// Server-side / adapter price verification: ensures prices match official catalog
export function validateAndRecalculateCart(items: CartItem[], coupon?: Coupon | null): {
  verifiedItems: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  isValid: boolean;
  errorMessage?: string;
} {
  if (!items || items.length === 0) {
    return {
      verifiedItems: [],
      subtotal: 0,
      discountAmount: 0,
      shippingFee: 0,
      totalAmount: 0,
      isValid: false,
      errorMessage: 'Cart is empty',
    };
  }

  const verifiedItems: OrderItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const adminProducts = useAdminStore.getState().products;
    let product = adminProducts.find((p) => p.slug === item.productSlug);
    if (!product) {
      product = getProductBySlug(item.productSlug);
    }
    if (!product) {
      return {
        verifiedItems: [],
        subtotal: 0,
        discountAmount: 0,
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
        discountAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
        isValid: false,
        errorMessage: `Selected variant for "${item.productName}" is no longer available.`,
      };
    }

    const officialPrice = variant.price;
    const lineTotal = officialPrice * item.quantity;
    subtotal += lineTotal;

    // Map brand to royalty rate and contract ID
    let royaltyRateSnapshot = 10.0;
    let licenseContractId = undefined;

    if (product.brandId === 'brand-f1-redbull') {
      royaltyRateSnapshot = 12.5;
      licenseContractId = 'contract-rbr-01';
    } else if (product.brandId === 'brand-f1-ferrari') {
      royaltyRateSnapshot = 14.0;
      licenseContractId = 'contract-sf-01';
    } else if (product.brandId === 'brand-music-travis') {
      royaltyRateSnapshot = 10.0;
      licenseContractId = 'contract-travis-01';
    } else if (product.brandId === 'brand-music-weeknd') {
      royaltyRateSnapshot = 10.0;
      licenseContractId = 'contract-weeknd-01';
    } else if (product.brandId === 'brand-football-real') {
      royaltyRateSnapshot = 15.0;
      licenseContractId = 'contract-real-01';
    } else if (product.brandId === 'brand-football-arsenal') {
      royaltyRateSnapshot = 15.0;
      licenseContractId = 'contract-arsenal-01';
    } else if (product.brandId === 'brand-collect-kaws') {
      royaltyRateSnapshot = 8.0;
      licenseContractId = 'contract-kaws-01';
    } else if (product.brandId === 'brand-collect-bearbrick') {
      royaltyRateSnapshot = 8.0;
      licenseContractId = 'contract-bearbrick-01';
    }

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
      royaltyRateSnapshot,
      licenseContractId,
      isPreorder: product.isPreorder,
      preorderReleaseAt: product.preorderReleaseAt,
    });
  }

  let discountAmount = 0;
  if (coupon) {
    if (!coupon.isActive) {
      return {
        verifiedItems: [],
        subtotal: 0,
        discountAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
        isValid: false,
        errorMessage: 'The applied coupon is inactive.',
      };
    }

    if (coupon.expiresAt && new Date().getTime() > new Date(coupon.expiresAt).getTime()) {
      return {
        verifiedItems: [],
        subtotal: 0,
        discountAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
        isValid: false,
        errorMessage: 'The applied coupon has expired.',
      };
    }

    if (coupon.maxGlobalUses !== undefined && coupon.currentGlobalUses >= coupon.maxGlobalUses) {
      return {
        verifiedItems: [],
        subtotal: 0,
        discountAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
        isValid: false,
        errorMessage: 'This coupon code has reached its maximum global usage limit.',
      };
    }

    if (coupon.maxUsesPerUser !== undefined) {
      const history = getOrderHistory();
      const userCouponUses = history.filter((o) => o.couponCode === coupon.code).length;
      if (userCouponUses >= coupon.maxUsesPerUser) {
        return {
          verifiedItems: [],
          subtotal: 0,
          discountAmount: 0,
          shippingFee: 0,
          totalAmount: 0,
          isValid: false,
          errorMessage: 'You have reached the usage limit for this coupon code.',
        };
      }
    }

    if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
      if (coupon.discountType === 'percentage') {
        discountAmount = Math.floor(subtotal * (coupon.discountValue / 100));
      } else {
        discountAmount = Math.min(subtotal, coupon.discountValue);
      }
    } else {
      return {
        verifiedItems: [],
        subtotal: 0,
        discountAmount: 0,
        shippingFee: 0,
        totalAmount: 0,
        isValid: false,
        errorMessage: `Minimum order value of ${coupon.minOrderValue} THB required to use this coupon.`,
      };
    }
  }

  const shippingFee = subtotal >= 3000 ? 0 : 100;
  const totalAmount = Math.max(0, subtotal - discountAmount) + shippingFee;

  return {
    verifiedItems,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    isValid: true,
  };
}

// Generate an official demo Order with Authenticity TAG assignment
export function fulfillMockOrder(
  items: CartItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  coupon?: Coupon | null
): Order {
  const calculation = validateAndRecalculateCart(items, coupon);
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
    discountAmount: calculation.discountAmount > 0 ? calculation.discountAmount : undefined,
    couponCode: coupon && calculation.discountAmount > 0 ? coupon.code : undefined,
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
