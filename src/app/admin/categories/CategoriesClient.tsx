'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/admin/Modal';
import { createCategoryAction, deleteCategoryAction } from './actions';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

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
  totalCount,
}: {
  initialCategories: CategoryDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryDto[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  const handleNameChange = (val: string) => {
    setValue('name', val);
    setValue(
      'slug',
      val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    );
  };

  const onSubmit = async (values: CategoryFormValues) => {
    const result = await createCategoryAction(values);
    if (result.success) {
      reset();
      setShowModal(false);
      router.refresh();
    } else {
      alert(result.error || 'Failed to create category.');
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Delete category "${catName}"? Products in this category may be affected.`)) return;
    const result = await deleteCategoryAction(id);
    if (result.success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(result.error);
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
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Category</span>
        </button>
      </div>

      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {categories.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Tag className="w-10 h-10 mx-auto text-neutral-400" />
              <h3 className="text-base font-bold text-black">No Categories Found</h3>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="p-5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                <div>
                  <span className="font-bold text-black text-sm">{cat.name}</span>
                  <div className="text-xs text-neutral-500 mt-1 font-mono">Slug: {cat.slug}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="px-3.5 py-2 rounded-xl border border-red-200 bg-white text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-50 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total categories)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/categories?page=${currentPage - 1}`)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/categories?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="New Category">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Name *
            </label>
            <input
              type="text"
              {...register('name')}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Headwear"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Slug *
            </label>
            <input
              type="text"
              {...register('slug')}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-black focus:outline-none focus:border-black"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-neutral-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </button>
            <button
              type="button"
              onClick={() => { setShowModal(false); reset(); }}
              className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
