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
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900 font-sans relative">
      {/* Ambient Premium Background Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-indigo-100/40 z-0"></div>
      
      {/* Navigation Sidebar (Relative z-index to sit above background) */}
      <div className="relative z-10 flex h-full">
        <NavSidebar />
      </div>

      {/* Admin Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Admin Top Header (Glassmorphism) */}
        <header className="bg-white/60 backdrop-blur-xl border-b border-white/80 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 tracking-tight">Merchandise &amp; IP Operations</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Logged in as <span className="font-semibold text-slate-900">{fullName}</span> ({user.email})
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl border border-white/80 bg-white/50 backdrop-blur-md text-slate-700 font-medium text-sm hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit to Storefront</span>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
