import { AdminTag, TagStatusValue } from '../../domain/entities/AdminTag';
import { PaginationParams, PaginatedResult } from './IAdminProductRepository';

export interface GenerateTagInput {
  orderItemId: string;
  sku: string;
  productName: string;
  brandName: string;
  size: string | null;
  orderNumber: string;
}

export interface IAdminTagRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<AdminTag>>;
  findByOrderItemId(orderItemId: string): Promise<AdminTag | null>;
  /** Generate and persist a new authenticity TAG — returns the created entity */
  generate(input: GenerateTagInput): Promise<AdminTag>;
  updateStatus(id: string, status: TagStatusValue): Promise<void>;
}
