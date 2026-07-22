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
    <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-8 transition-colors shadow-sm">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-foreground transition-colors">
          Collector Profile
        </h2>
        <p className="text-xs text-muted mt-1 transition-colors">
          Manage your personal details and contact information for order fulfillment.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
            Email Address (Read Only)
          </label>
          <input
            type="email"
            disabled
            value={user.email}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-mono text-muted cursor-not-allowed transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
            Full Name
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
            Phone Number
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="089-123-4567"
            className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>

          {savedMessage && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground transition-colors animate-in fade-in duration-300">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Profile Updated</span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
