'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Plus, Check, FolderTree, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CategoriesClient({ 
  initialCategories,
  currentPage,
  totalPages,
  totalCount
}: { 
  initialCategories: any[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [categories, setCategories] = useState<any[]>(initialCategories);
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !supabase) return;

    setIsLoading(true);

    try {
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          name: name.trim(),
          slug: slug.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
      setName('');
      setSlug('');
      setShowForm(false);
      
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
      router.refresh();
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category. The slug might already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!supabase) return;
    
    if (confirm('Are you sure you want to delete this category? Products in this category might be affected.')) {
      const previousCategories = [...categories];
      setCategories(categories.filter(c => c.id !== categoryId));
      
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', categoryId);
          
        if (error) throw error;
        router.refresh();
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category. It might be in use by existing products.');
        setCategories(previousCategories);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <FolderTree className="w-6 h-6" />
            Product Categories
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Manage product categorization and navigation structure.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-black flex items-center gap-2 text-xs font-bold text-black">
          <Check className="w-4 h-4" />
          <span>New category created successfully.</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4 max-w-2xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-2">
            Category Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Formula 1 Apparel"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Category'}
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

      {/* Table */}
      {categories.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-3">
          <FolderTree className="w-10 h-10 mx-auto text-neutral-400" />
          <h3 className="text-base font-bold text-black">No Categories Found</h3>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
          <div className="divide-y divide-neutral-200">
            {categories.map((category) => (
              <div key={category.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{category.name}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 font-mono">
                    Slug: {category.slug}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(category.id)}
                  className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-50 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total categories)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/categories?page=${currentPage - 1}`)}
              disabled={currentPage <= 1 || isLoading}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/categories?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages || isLoading}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
