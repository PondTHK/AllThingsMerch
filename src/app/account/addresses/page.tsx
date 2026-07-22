'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { Plus, Trash2, Check } from 'lucide-react';

export default function AccountAddressesPage() {
  const addresses = useAuthStore((state) => state.addresses);
  const addAddress = useAuthStore((state) => state.addAddress);
  const deleteAddress = useAuthStore((state) => state.deleteAddress);
  const setDefaultAddress = useAuthStore((state) => state.setDefaultAddress);

  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState('Office Address');
  const [fullName, setFullName] = useState('Thanakhon Collector');
  const [email, setEmail] = useState('collector@allthingsmerch.demo');
  const [phone, setPhone] = useState('089-123-4567');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Bangkok');
  const [postalCode, setPostalCode] = useState('10110');
  const [isDefault, setIsDefault] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim() || !city.trim() || !postalCode.trim()) return;

    addAddress({
      label: label.trim(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      isDefault,
    });

    setStreet('');
    setShowForm(false);
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
                Email Address
              </label>
              <input
                type="email"
                required
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
                type="text"
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
                placeholder="123 Sukhumvit Road..."
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

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isDefault" className="text-xs font-bold text-foreground uppercase tracking-wider transition-colors">
              Set as Default Shipping Address
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-bold uppercase tracking-wider hover:border-foreground transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-6 rounded-2xl border transition-all space-y-3 ${
              addr.isDefault
                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm'
                : 'border-border bg-surface hover:border-foreground'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-foreground transition-colors">
                {addr.label}
              </span>
              {addr.isDefault && (
                <span className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Check className="w-3 h-3" />
                  <span>Default</span>
                </span>
              )}
            </div>

            <div className="text-xs text-muted space-y-1 transition-colors">
              <div className="font-bold text-foreground transition-colors">{addr.fullName}</div>
              <div>
                {addr.street}, {addr.city} {addr.postalCode}
              </div>
              <div className="text-muted transition-colors">Phone: {addr.phone}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border transition-colors">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-[11px] font-bold uppercase tracking-wider text-muted hover:text-foreground underline transition-colors"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[11px] text-muted transition-colors">Primary Delivery Address</span>
              )}

              <button
                type="button"
                onClick={() => deleteAddress(addr.id)}
                aria-label="Delete address"
                className="p-1.5 text-muted hover:text-foreground transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
