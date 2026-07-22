'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { CartItem } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getDbCartAction(): Promise<CartItem[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      id,
      quantity,
      reserved_until,
      product_variants (
        id,
        price,
        sku,
        size,
        color,
        products (
          id,
          name,
          slug,
          is_preorder,
          product_images (
            storage_path,
            sort_order
          )
        )
      )
    `)
    .eq('user_id', user.id);

  if (error || !data) {
    console.error('Failed to fetch DB cart:', error);
    return [];
  }

  return data.map((row: any) => {
    const variant = row.product_variants;
    const product = variant?.products;
    const images = product?.product_images || [];
    
    // Sort images by sort_order
    const sortedImages = [...images].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const mainImage = sortedImages[0]?.storage_path || undefined;

    return {
      id: row.id,
      productId: product?.id || '',
      variantId: variant?.id || '',
      productName: product?.name || 'Unknown Product',
      productSlug: product?.slug || '',
      sku: variant?.sku || '',
      size: variant?.size || undefined,
      color: variant?.color || undefined,
      unitPrice: Number(variant?.price || 0),
      quantity: row.quantity,
      isPreorder: product?.is_preorder || false,
      imageUrl: mainImage || '',
      brandName: 'AllThingsMerch',
      reservedUntil: row.reserved_until || undefined,
    };
  });
}

export async function addToDbCartAction(variantId: string, quantity: number, reservedUntil?: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Insert or update on conflict
  const { error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: user.id,
      product_variant_id: variantId,
      quantity,
      reserved_until: reservedUntil || null,
    }, {
      onConflict: 'user_id,product_variant_id'
    });

  if (error) {
    console.error('Failed to add to DB cart:', error);
    throw new Error(error.message);
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
}

export async function updateDbCartQuantityAction(variantId: string, quantity: number) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('user_id', user.id)
    .eq('product_variant_id', variantId);

  if (error) {
    console.error('Failed to update DB cart quantity:', error);
    throw new Error(error.message);
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
}

export async function removeFromDbCartAction(variantId: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)
    .eq('product_variant_id', variantId);

  if (error) {
    console.error('Failed to remove from DB cart:', error);
    throw new Error(error.message);
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
}

export async function clearDbCartAction() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id);

  if (error) {
    console.error('Failed to clear DB cart:', error);
    throw new Error(error.message);
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
}

export async function syncLocalCartToDbAction(localItems: CartItem[]) {
  if (localItems.length === 0) return { success: true };

  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Insert all local items, or increment if conflict
  for (const item of localItems) {
    // Check if item already exists in DB
    const { data: existing } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id)
      .eq('product_variant_id', item.variantId)
      .single();

    if (existing) {
      const newQty = existing.quantity + item.quantity;
      await supabase
        .from('cart_items')
        .update({ quantity: newQty })
        .eq('user_id', user.id)
        .eq('product_variant_id', item.variantId);
    } else {
      await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_variant_id: item.variantId,
          quantity: item.quantity,
          reserved_until: item.reservedUntil || null,
        });
    }
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
  return { success: true };
}
