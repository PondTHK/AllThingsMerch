import { describe, it, expect } from 'vitest';
import { validateAndRecalculateCart, fulfillMockOrder } from '@/lib/orders/mock-checkout';
import { CartItem } from '@/types';

describe('Mock Checkout & Price Verification', () => {
  const sampleCartItem: CartItem = {
    id: 'cart-1',
    productId: 'prod-f1-redbull-polo',
    variantId: 'var-rbr-p-m',
    productName: 'Red Bull Racing 2026 Team Polo',
    productSlug: 'red-bull-racing-2026-team-polo',
    sku: 'RBR-POLO26-M',
    size: 'M',
    unitPrice: 3990,
    quantity: 1,
    imageUrl: '',
    brandName: 'Oracle Red Bull Racing',
  };

  it('validates and recalculates cart correctly with free shipping over 3,000 THB', () => {
    const res = validateAndRecalculateCart([sampleCartItem]);
    expect(res.isValid).toBe(true);
    expect(res.subtotal).toBe(3990);
    expect(res.shippingFee).toBe(0); // free shipping over 3,000 THB
    expect(res.totalAmount).toBe(3990);
  });

  it('generates 1-to-1 Authenticity TAGs upon mock fulfillment', () => {
    const order = fulfillMockOrder(
      [sampleCartItem],
      {
        fullName: 'Test Collector',
        email: 'test@allthingsmerch.demo',
        phone: '081-000-0000',
        street: '123 Test Street',
        city: 'Bangkok',
        postalCode: '10110',
      },
      'credit-card'
    );

    expect(order.orderNumber).toMatch(/^ATM-2026-\d{4}$/);
    expect(order.isDemoOrder).toBe(true);
    expect(order.items.length).toBe(1);
    expect(order.items[0].authenticityTagCode).toBeDefined();
    expect(order.items[0].authenticityTagCode).toContain('TAG-ATM');
  });

  it('captures the correct royalty rate snapshot and contract reference during checkout', () => {
    const res = validateAndRecalculateCart([sampleCartItem]);
    expect(res.isValid).toBe(true);
    expect(res.verifiedItems[0].royaltyRateSnapshot).toBe(12.5);
    expect(res.verifiedItems[0].licenseContractId).toBe('contract-rbr-01');
  });
});
