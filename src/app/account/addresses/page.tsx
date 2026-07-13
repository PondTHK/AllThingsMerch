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
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Saved Shipping Addresses
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Manage your delivery destinations for fast checkout fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4 max-w-2xl"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">
            Add Delivery Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Address Label
              </label>
              <input
                type="text"
                required
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="123 Sukhumvit Road..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                City / Province
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                required
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
            />
            <label htmlFor="isDefault" className="text-xs font-bold text-black uppercase tracking-wider">
              Set as Default Shipping Address
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200"
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
                ? 'border-black bg-neutral-100'
                : 'border-neutral-200 bg-white hover:border-black'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-black">
                {addr.label}
              </span>
              {addr.isDefault && (
                <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Default</span>
                </span>
              )}
            </div>

            <div className="text-xs text-neutral-600 space-y-1">
              <div className="font-bold text-black">{addr.fullName}</div>
              <div>
                {addr.street}, {addr.city} {addr.postalCode}
              </div>
              <div className="text-neutral-500">Phone: {addr.phone}</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => setDefaultAddress(addr.id)}
                  className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 hover:text-black underline"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[11px] text-neutral-400">Primary Delivery Address</span>
              )}

              <button
                type="button"
                onClick={() => deleteAddress(addr.id)}
                aria-label="Delete address"
                className="p-1.5 text-neutral-400 hover:text-black transition-colors"
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
