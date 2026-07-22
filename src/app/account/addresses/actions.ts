'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { SavedAddress } from '@/types';

// Use the existing ShippingAddress type but add db specific fields if needed
// Actually we map it to SavedAddress from src/types/index.ts

export async function getUserAddressesAction(): Promise<SavedAddress[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch user addresses:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    label: row.label,
    fullName: row.full_name,
    email: row.email || undefined,
    phone: row.phone,
    street: row.street,
    city: row.city,
    postalCode: row.postal_code,
    isDefault: row.is_default,
  }));
}

export async function addAddressAction(addressData: Omit<SavedAddress, 'id'>) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // If this is set as default, we need to unset others first
  if (addressData.isDefault) {
    await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);
  } else {
    // If it's the first address, make it default automatically
    const { count } = await supabase
      .from('user_addresses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
      
    if (count === 0) {
      addressData.isDefault = true;
    }
  }

  const { data, error } = await supabase
    .from('user_addresses')
    .insert({
      user_id: user.id,
      label: addressData.label,
      full_name: addressData.fullName,
      email: addressData.email || null,
      phone: addressData.phone,
      street: addressData.street,
      city: addressData.city,
      postal_code: addressData.postalCode,
      is_default: addressData.isDefault,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to add address: ${error.message}`);
  
  revalidatePath('/account/addresses');
  revalidatePath('/checkout');
  
  return { success: true, addressId: data.id };
}

export async function updateAddressAction(id: string, addressData: Partial<SavedAddress>) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  if (addressData.isDefault) {
    await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', user.id);
  }

  const updates: Record<string, any> = {};
  if (addressData.label !== undefined) updates.label = addressData.label;
  if (addressData.fullName !== undefined) updates.full_name = addressData.fullName;
  if (addressData.email !== undefined) updates.email = addressData.email;
  if (addressData.phone !== undefined) updates.phone = addressData.phone;
  if (addressData.street !== undefined) updates.street = addressData.street;
  if (addressData.city !== undefined) updates.city = addressData.city;
  if (addressData.postalCode !== undefined) updates.postal_code = addressData.postalCode;
  if (addressData.isDefault !== undefined) updates.is_default = addressData.isDefault;

  const { error } = await supabase
    .from('user_addresses')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id); // Ensure they only update their own

  if (error) throw new Error(`Failed to update address: ${error.message}`);

  revalidatePath('/account/addresses');
  revalidatePath('/checkout');
  
  return { success: true };
}

export async function deleteAddressAction(id: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(`Failed to delete address: ${error.message}`);

  revalidatePath('/account/addresses');
  revalidatePath('/checkout');
  
  return { success: true };
}

export async function setDefaultAddressAction(id: string) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase not configured');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Unset all first
  await supabase
    .from('user_addresses')
    .update({ is_default: false })
    .eq('user_id', user.id);

  // Set new default
  const { error } = await supabase
    .from('user_addresses')
    .update({ is_default: true })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(`Failed to set default address: ${error.message}`);

  revalidatePath('/account/addresses');
  revalidatePath('/checkout');
  
  return { success: true };
}
