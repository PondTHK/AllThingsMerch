import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { NavSidebar } from './NavSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  
  if (!supabase) {
    return <div className="p-16 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const role = user.app_metadata?.role || user.user_metadata?.role;
  
  if (role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 border border-black mx-auto flex items-center justify-center text-black">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-black">Curator Admin Access Required</h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          This portal is reserved for authorized merchandising curators, inventory controllers, and IP licensing administrators.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-neutral-300 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  const fullName = user.user_metadata?.full_name || user.user_metadata?.fullName || 'Curator Admin';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Admin Top Banner */}
      <div className="border-b border-neutral-300 pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-2.5 py-1 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider mb-2">
            Curator Admin Control Center
          </div>
          <h1 className="text-3xl font-black text-black">Merchandise &amp; IP Operations</h1>
          <p className="text-xs text-neutral-600 mt-1">
            Logged in as <span className="font-bold text-black">{fullName}</span> ({user.email})
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Storefront</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <NavSidebar />

        {/* Admin Main Content Area */}
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
