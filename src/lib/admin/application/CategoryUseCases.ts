import { AdminCategory } from '../domain/entities/AdminCategory';
import {
  IAdminCategoryRepository,
  CreateCategoryInput,
} from '../ports/outbound/IAdminCategoryRepository';
import { PaginationParams, PaginatedResult } from '../ports/outbound/IAdminProductRepository';

export class CategoryUseCases {
  constructor(private readonly repo: IAdminCategoryRepository) {}

  async listCategories(params: PaginationParams): Promise<PaginatedResult<AdminCategory>> {
    return this.repo.findAll(params);
  }

  async listAllCategories(): Promise<AdminCategory[]> {
    return this.repo.findAllFlat();
  }

  async createCategory(input: CreateCategoryInput): Promise<AdminCategory> {
    if (!input.name.trim()) throw new Error('Category name is required.');
    if (!input.slug.trim()) throw new Error('Category slug is required.');
    return this.repo.create(input);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
