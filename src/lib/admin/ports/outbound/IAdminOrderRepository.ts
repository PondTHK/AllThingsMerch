import { AdminOrder } from '../../domain/entities/AdminOrder';
import { OrderStatusValue } from '../../domain/value-objects/OrderStatus';
import { PaginationParams, PaginatedResult } from './IAdminProductRepository';

export interface IAdminOrderRepository {
  findAll(params: PaginationParams): Promise<PaginatedResult<AdminOrder>>;
  findById(id: string): Promise<AdminOrder | null>;
  updateStatus(id: string, status: OrderStatusValue): Promise<void>;
  /** Revenue sum for orders with revenue-counting statuses */
  sumRevenue(): Promise<number>;
  count(): Promise<number>;
}
