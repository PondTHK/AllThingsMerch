import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/lib/cart/useCartStore';
import { useAdminStore } from '@/lib/admin/useAdminStore';
import { validateAndRecalculateCart } from '@/lib/orders/mock-checkout';
import { CartItem, Product, Coupon, Order } from '@/types';

describe('Storefront Logic & Data Integrity', () => {
  const inStockProduct: Product = {
    id: 'prod-in-stock',
    brandId: 'b1111111-1111-4111-8111-111111111111',
    categoryId: 'c1111111-1111-4111-8111-111111111111',
    name: 'In Stock Shirt',
    slug: 'in-stock-shirt',
    description: 'Comes ready to ship.',
    status: 'active',
    isPreorder: false,
    minPrice: 1000,
    maxPrice: 1000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      {
        id: 'var-in-stock',
        productId: 'prod-in-stock',
        sku: 'SHIRT-IN-STOCK',
        size: 'M',
        price: 1000,
        stockQuantity: 10,
        lowStockThreshold: 2,
        isActive: true,
      },
    ],
    images: [],
    featuredImage: '',
  };

  const preOrderProduct: Product = {
    id: 'prod-pre-order',
    brandId: 'b1111111-1111-4111-8111-111111111111',
    categoryId: 'c1111111-1111-4111-8111-111111111111',
    name: 'Pre Order Shirt',
    slug: 'pre-order-shirt',
    description: 'Launches next month.',
    status: 'active',
    isPreorder: true,
    preorderReleaseAt: '2026-10-31',
    minPrice: 1500,
    maxPrice: 1500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      {
        id: 'var-pre-order',
        productId: 'prod-pre-order',
        sku: 'SHIRT-PRE-ORDER',
        size: 'L',
        price: 1500,
        stockQuantity: 5,
        lowStockThreshold: 1,
        isActive: true,
      },
    ],
    images: [],
    featuredImage: '',
  };

  beforeEach(() => {
    // Reset Zustand stores
    useCartStore.setState({ items: [], appliedCoupon: null, cartReservedUntil: null });
    useAdminStore.setState({
      products: [inStockProduct, preOrderProduct],
      orders: [],
      stockMovements: [],
    });
  });

  it('allows mixing pre-order and in-stock items in the same cart (Issue 1 UX Update)', () => {
    // Add in-stock product
    useCartStore.getState().addItem(inStockProduct.variants[0], inStockProduct, 1);
    expect(useCartStore.getState().items.length).toBe(1);

    // Adding pre-order product -> should succeed
    useCartStore.getState().addItem(preOrderProduct.variants[0], preOrderProduct, 1);
    expect(useCartStore.getState().items.length).toBe(2);

    const calc = validateAndRecalculateCart(useCartStore.getState().items, null);
    expect(calc.isValid).toBe(true);
    expect(calc.totalAmount).toBe(2600); // 1000 + 1500 + 100 shipping (subtotal 2500 < 3000)
  });

  it('creates stock reservation movements on cart add and releases on item removal (Issues 2 & 4)', () => {
    // Initial variant stock is 10
    const varId = inStockProduct.variants[0].id;
    
    // Add to cart
    useCartStore.getState().addItem(inStockProduct.variants[0], inStockProduct, 2);
    
    // Verify admin stock is decremented to 8
    const updatedProd = useAdminStore.getState().products.find(p => p.id === inStockProduct.id);
    expect(updatedProd?.variants[0].stockQuantity).toBe(8);

    // Verify stock movement of type 'reserve' exists
    const movements = useAdminStore.getState().stockMovements;
    expect(movements.length).toBe(1);
    expect(movements[0].movementType).toBe('reserve');
    expect(movements[0].quantity).toBe(-2);
    expect(movements[0].productVariantId).toBe(varId);

    // Remove from cart
    useCartStore.getState().removeItem(varId);

    // Verify stock goes back to 10
    const finalProd = useAdminStore.getState().products.find(p => p.id === inStockProduct.id);
    expect(finalProd?.variants[0].stockQuantity).toBe(10);

    // Verify 'release' stock movement was logged
    const finalMovements = useAdminStore.getState().stockMovements;
    expect(finalMovements.length).toBe(2);
    expect(finalMovements[0].movementType).toBe('release');
    expect(finalMovements[0].quantity).toBe(2);
  });

  it('refunds inventory stock upon order cancellation (Issue 3)', () => {
    const varId = inStockProduct.variants[0].id;

    // Setup an existing order
    const orderId = 'ord-123';
    const mockOrder: Order = {
      id: orderId,
      orderNumber: 'ATM-2026-9999',
      status: 'fulfilled',
      items: [
        {
          id: 'item-1',
          productId: inStockProduct.id,
          variantId: varId,
          productName: inStockProduct.name,
          sku: inStockProduct.variants[0].sku,
          size: inStockProduct.variants[0].size,
          unitPrice: inStockProduct.variants[0].price,
          quantity: 3,
          totalPrice: inStockProduct.variants[0].price * 3,
          royaltyRateSnapshot: 10,
        },
      ],
      subtotal: 3000,
      totalAmount: 3000,
      shippingAddress: {
        fullName: 'Test User',
        email: 'test@user.com',
        phone: '123456',
        street: 'Main Rd',
        city: 'BKK',
        postalCode: '10000',
      },
      paymentMethod: 'credit-card',
      shippingFee: 0,
      isDemoOrder: true,
      createdAt: new Date().toISOString(),
    };

    useAdminStore.setState({
      products: [inStockProduct],
      orders: [mockOrder],
      stockMovements: [],
    });

    // Cancel order
    useAdminStore.getState().updateOrderStatus(mockOrder.orderNumber, 'cancelled');

    // Verify stock went from 10 to 13
    const finalProd = useAdminStore.getState().products.find(p => p.id === inStockProduct.id);
    expect(finalProd?.variants[0].stockQuantity).toBe(13);

    // Verify return movement logged
    const movements = useAdminStore.getState().stockMovements;
    expect(movements.length).toBe(1);
    expect(movements[0].movementType).toBe('return');
    expect(movements[0].quantity).toBe(3);
    expect(movements[0].referenceId).toBe(orderId);
  });

  it('enforces coupon limits (maxGlobalUses and maxUsesPerUser) (Issue 5)', () => {
    const coupon: Coupon = {
      id: 'coupon-limit',
      code: 'LIMITED50',
      discountType: 'fixed',
      discountValue: 50,
      currentGlobalUses: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const cartItem: CartItem = {
      id: 'cart-item-1',
      productId: inStockProduct.id,
      variantId: inStockProduct.variants[0].id,
      productName: inStockProduct.name,
      productSlug: inStockProduct.slug,
      sku: inStockProduct.variants[0].sku,
      size: inStockProduct.variants[0].size,
      unitPrice: 1000,
      quantity: 1,
      imageUrl: '',
    };

    // Case 1: maxGlobalUses exceeded
    const globalLimitCoupon: Coupon = {
      ...coupon,
      maxGlobalUses: 5,
      currentGlobalUses: 5,
    };
    let check = validateAndRecalculateCart([cartItem], globalLimitCoupon);
    expect(check.isValid).toBe(false);
    expect(check.errorMessage).toContain('maximum global usage limit');

    // Case 2: maxUsesPerUser exceeded
    const userLimitCoupon: Coupon = {
      ...coupon,
      maxUsesPerUser: 1,
      currentGlobalUses: 0,
    };
    
    // Simulate user has already placed an order with this coupon
    const pastOrder: Order = {
      id: 'ord-past',
      orderNumber: 'ATM-2026-8888',
      status: 'fulfilled',
      couponCode: 'LIMITED50',
      items: [],
      subtotal: 1000,
      totalAmount: 950,
      shippingAddress: {
        fullName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        postalCode: ''
      },
      paymentMethod: 'credit-card',
      shippingFee: 0,
      isDemoOrder: true,
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage order history helper
    localStorage.setItem('allthingsmerch-orders', JSON.stringify([pastOrder]));

    check = validateAndRecalculateCart([cartItem], userLimitCoupon);
    expect(check.isValid).toBe(false);
    expect(check.errorMessage).toContain('reached the usage limit for this coupon');
    
    // Clean up localStorage
    localStorage.removeItem('allthingsmerch-orders');
  });
});
