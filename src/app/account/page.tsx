'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { Save, Check } from 'lucide-react';

export default function AccountProfilePage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [fullName, setFullName] = useState(() => user?.fullName || '');
  const [phone, setPhone] = useState(() => user?.phone || '');
  const [savedMessage, setSavedMessage] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
    });
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-6 sm:p-8 space-y-8">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-black">
          Collector Profile
        </h2>
        <p className="text-xs text-neutral-600 mt-1">
          Manage your personal details and contact information for order fulfillment.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Email Address (Read Only)
          </label>
          <input
            type="email"
            disabled
            value={user.email}
            className="w-full px-4 py-3 rounded-xl bg-neutral-200 border border-neutral-300 text-sm font-mono text-neutral-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="089-123-4567"
            className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>

          {savedMessage && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-black">
              <Check className="w-4 h-4" />
              <span>Profile Updated</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
