import { NextResponse } from 'next/server';
import { fulfillMockOrder } from '@/lib/orders/mock-checkout';
import { CartItem, ShippingAddress, Coupon } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, coupon } = body as {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      coupon?: Coupon | null;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const order = await fulfillMockOrder(items, shippingAddress, paymentMethod, coupon);

    return NextResponse.json({ order });
  } catch (err: unknown) {
    console.error('Checkout API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to complete checkout' },
      { status: 500 }
    );
  }
}
