'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { AuthenticityTagRecord } from '@/types';

export async function verifyAuthenticityTagAction(code: string): Promise<AuthenticityTagRecord | null> {
  if (!code || !code.trim()) return null;
  const normalized = code.trim().toUpperCase();

  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('authenticity_tags')
    .select(`
      *,
      order_items (
        id,
        product_name,
        sku,
        product_variants (
          size,
          products (
            id,
            name,
            brands (
              name
            )
          )
        ),
        orders (
          order_number
        )
      )
    `)
    .or(`public_code.eq.${normalized},serial_number.eq.${normalized}`)
    .single();

  if (error || !data) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = (data as any).order_items;
  const variant = item?.product_variants;
  const product = variant?.products;
  const brand = product?.brands;
  const order = item?.orders;

  return {
    tagCode: data.public_code || normalized,
    serialNumber: data.serial_number || '',
    productId: product?.id || '',
    productName: product?.name || item?.product_name || 'AllThingsMerch Release',
    brandName: brand?.name || 'AllThingsMerch',
    sku: item?.sku || '',
    size: variant?.size || undefined,
    status: (data.status || 'issued') as 'active' | 'flagged' | 'revoked',
    issuedAt: data.issued_at || new Date().toISOString(),
    orderNumber: order?.order_number || undefined,
  };
}
