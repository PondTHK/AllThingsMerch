'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Check, Loader2 } from 'lucide-react';
import { SavedAddress } from '@/types';
import { addAddressAction, deleteAddressAction, setDefaultAddressAction } from './actions';

export function AddressesClient({ initialAddresses }: { initialAddresses: SavedAddress[] }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [label, setLabel] = useState('Home');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !postalCode.trim() || !fullName.trim() || !phone.trim() || !label.trim()) return;

    setIsSubmitting(true);
    try {
      await addAddressAction({
        label: label.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        isDefault,
      });

      // Optimistically update
      setAddresses([...addresses, {
        id: `temp-${Date.now()}`,
        label: label.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        isDefault,
      }]);

      setStreet('');
      setCity('');
      setPostalCode('');
      setFullName('');
      setPhone('');
      setEmail('');
      setLabel('Home');
      setIsDefault(false);
      setShowForm(false);
      // Wait a bit for revalidatePath to kick in
      setTimeout(() => window.location.reload(), 500);
    } catch (err: any) {
      alert(err.message || 'Failed to add address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('temp-')) return;
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await deleteAddressAction(id);
      setAddresses(addresses.filter(a => a.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    if (id.startsWith('temp-')) return;
    try {
      await setDefaultAddressAction(id);
      setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    } catch (err: any) {
      alert(err.message || 'Failed to set default');
    }
  };

  return (
    <div className="space-y-8 transition-colors">
      <div className="flex items-center justify-between border-b border-border pb-4 transition-colors">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-foreground transition-colors">
            Saved Shipping Addresses
          </h2>
          <p className="text-xs text-muted mt-1 transition-colors">
            Manage your delivery destinations for fast checkout fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-surface border border-border space-y-4 max-w-2xl transition-colors shadow-sm"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground transition-colors">
            Add Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                Address Label
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Home, Office"
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                Recipient Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                Street Address
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                City / Province
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                Postal Code
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background"
            />
            <label htmlFor="isDefault" className="text-xs font-medium text-foreground transition-colors">
              Set as default shipping address
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Address
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-surface transition-colors">
          <p className="text-muted text-sm font-medium transition-colors">
            You don&apos;t have any saved addresses yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`p-5 rounded-2xl border transition-colors relative ${
                address.isDefault ? 'border-primary bg-primary/5' : 'border-border bg-surface'
              }`}
            >
              {address.isDefault && (
                <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Default
                </span>
              )}
              
              <div className="pr-20">
                <h4 className="text-sm font-bold text-foreground transition-colors flex items-center gap-2">
                  {address.label}
                </h4>
                <div className="mt-3 space-y-1 text-xs text-muted font-medium transition-colors">
                  <p className="text-foreground font-bold">{address.fullName}</p>
                  <p>{address.phone}</p>
                  {address.email && <p>{address.email}</p>}
                  <p className="mt-2">{address.street}</p>
                  <p>
                    {address.city} {address.postalCode}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between transition-colors">
                {!address.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-[10px] font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
                  >
                    Set as default
                  </button>
                ) : (
                  <div /> // Spacer
                )}

                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
