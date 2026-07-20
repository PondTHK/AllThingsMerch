import { IAdminInventoryRepository } from '../ports/outbound/IAdminInventoryRepository';
import { IAdminOrderRepository } from '../ports/outbound/IAdminOrderRepository';
import { IAdminContractRepository } from '../ports/outbound/IAdminContractRepository';
import { AdminInventoryVariant } from '../domain/entities/AdminInventoryVariant';

export interface DashboardMetrics {
  activeProductsCount: number;
  totalProductsCount: number;
  totalStockUnits: number;
  lowStockVariants: AdminInventoryVariant[];
  totalRevenue: number;
  orderCount: number;
  activeContractsCount: number;
}

/**
 * DashboardUseCases — aggregates metrics from multiple repositories
 * in a single, parallel fetch for the overview page.
 */
export class DashboardUseCases {
  constructor(
    private readonly inventoryRepo: IAdminInventoryRepository,
    private readonly orderRepo: IAdminOrderRepository,
    private readonly contractRepo: IAdminContractRepository,
  ) {}

  async getMetrics(
    activeProductsCount: number,
    totalProductsCount: number,
  ): Promise<DashboardMetrics> {
    // Parallel fetch — performant, no sequential awaits
    const [totalStockUnits, lowStockVariants, totalRevenue, orderCount, activeContractsCount] =
      await Promise.all([
        this.inventoryRepo.getTotalStockUnits(),
        this.inventoryRepo.findLowStock(),
        this.orderRepo.sumRevenue(),
        this.orderRepo.count(),
        this.contractRepo.countActive(),
      ]);

    return {
      activeProductsCount,
      totalProductsCount,
      totalStockUnits,
      lowStockVariants,
      totalRevenue,
      orderCount,
      activeContractsCount,
    };
  }
}
