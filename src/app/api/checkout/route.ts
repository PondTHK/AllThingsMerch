import { NextResponse } from 'next/server';
import { placeOrderAction } from '@/app/checkout/actions';
import { CartItem, ShippingAddress, Coupon } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, coupon } = body as {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: any;
      coupon?: Coupon | null;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderResult = await placeOrderAction(items, shippingAddress, paymentMethod, coupon?.code);

    return NextResponse.json({ orderNumber: orderResult.orderNumber });
  } catch (err: unknown) {
    console.error('Checkout API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to complete checkout' },
      { status: 500 }
    );
  }
}
