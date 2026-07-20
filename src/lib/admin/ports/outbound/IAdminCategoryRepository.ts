import { AdminCategory } from '../../domain/entities/AdminCategory';
import { PaginationParams, PaginatedResult } from './IAdminProductRepository';

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: string;
}

export interface IAdminCategoryRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<AdminCategory>>;
  findAllFlat(): Promise<AdminCategory[]>;
  findById(id: string): Promise<AdminCategory | null>;
  create(input: CreateCategoryInput): Promise<AdminCategory>;
  delete(id: string): Promise<void>;
}
