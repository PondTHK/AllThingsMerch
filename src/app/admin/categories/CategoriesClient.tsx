'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createCategoryAction, deleteCategoryAction } from './actions';

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export function CategoriesClient({
  initialCategories,
  currentPage,
  totalPages,
  totalCount
}: {
  initialCategories: CategoryDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDto[]>(initialCategories);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setIsLoading(true);

    const result = await createCategoryAction({ name: name.trim(), slug: slug.trim() });
    if (result.success) {
      setName(''); setSlug(''); setShowForm(false);
      router.refresh();
    } else {
      alert(result.error || 'Failed to create category.');
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"? Products in this category may be affected.`)) return;
    const result = await deleteCategoryAction(id);
    if (result.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(result.error || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Tag className="w-6 h-6" />
            Product Categories
          </h2>
          <p className="text-xs text-neutral-600 mt-1">Organize your merchandise catalog into collections.</p>
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors">
          <Plus className="w-3.5 h-3.5" /><span>New Category</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4 max-w-2xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Name *</label>
              <input type="text" required value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Headwear"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Slug *</label>
              <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono text-black focus:outline-none focus:border-black" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create Category'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200">Cancel</button>
          </div>
        </form>
      )}

      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {categories.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Tag className="w-10 h-10 mx-auto text-neutral-400" />
              <h3 className="text-base font-bold text-black">No Categories Found</h3>
            </div>
          ) : categories.map((cat) => (
            <div key={cat.id} className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
              <div>
                <span className="font-bold text-black text-sm">{cat.name}</span>
                <div className="text-xs text-neutral-500 mt-1 font-mono">Slug: {cat.slug}</div>
              </div>
              <button type="button" onClick={() => handleDelete(cat.id, cat.name)}
                className="px-3.5 py-2 rounded-xl border border-red-200 bg-white text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-50 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /><span>Delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">Showing page {currentPage} of {totalPages} ({totalCount} total categories)</p>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push(`/admin/categories?page=${currentPage - 1}`)} disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50">Previous</button>
            <button onClick={() => router.push(`/admin/categories?page=${currentPage + 1}`)} disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
