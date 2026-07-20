import { SupabaseClient } from '@supabase/supabase-js';

// Repositories (Ports & Adapters)
import { SupabaseAdminProductRepo } from './adapters/supabase/SupabaseAdminProductRepo';
import { SupabaseAdminOrderRepo } from './adapters/supabase/SupabaseAdminOrderRepo';
import { SupabaseAdminBrandRepo } from './adapters/supabase/SupabaseAdminBrandRepo';
import { SupabaseAdminCategoryRepo } from './adapters/supabase/SupabaseAdminCategoryRepo';
import { SupabaseAdminInventoryRepo } from './adapters/supabase/SupabaseAdminInventoryRepo';
import { SupabaseAdminContractRepo } from './adapters/supabase/SupabaseAdminContractRepo';
import { SupabaseAdminTagRepo } from './adapters/supabase/SupabaseAdminTagRepo';
import { SupabaseAdminCouponRepo } from './adapters/supabase/SupabaseAdminCouponRepo';

// Use Cases (Application Layer)
import { ProductUseCases } from './application/ProductUseCases';
import { OrderUseCases } from './application/OrderUseCases';
import { BrandUseCases } from './application/BrandUseCases';
import { CategoryUseCases } from './application/CategoryUseCases';
import { InventoryUseCases } from './application/InventoryUseCases';
import { ContractUseCases } from './application/ContractUseCases';
import { TagUseCases } from './application/TagUseCases';
import { CouponUseCases } from './application/CouponUseCases';
import { DashboardUseCases } from './application/DashboardUseCases';

/**
 * Dependency Injection Container
 *
 * This is the ONLY place where Use Cases and their Adapters are wired together.
 * The UI layer calls `getAdminServices(supabase)` to get fully typed use cases.
 * If we ever migrate away from Supabase, we only change the instantiations here.
 */
export function getAdminServices(supabaseClient: SupabaseClient) {
  // 1. Initialize Adapters (Infrastructure)
  const productRepo = new SupabaseAdminProductRepo(supabaseClient);
  const orderRepo = new SupabaseAdminOrderRepo(supabaseClient);
  const brandRepo = new SupabaseAdminBrandRepo(supabaseClient);
  const categoryRepo = new SupabaseAdminCategoryRepo(supabaseClient);
  const inventoryRepo = new SupabaseAdminInventoryRepo(supabaseClient);
  const contractRepo = new SupabaseAdminContractRepo(supabaseClient);
  const tagRepo = new SupabaseAdminTagRepo(supabaseClient);
  const couponRepo = new SupabaseAdminCouponRepo(supabaseClient);

  // 2. Initialize Use Cases (Application)
  const products = new ProductUseCases(productRepo);
  const orders = new OrderUseCases(orderRepo, tagRepo); // OrderUseCases needs both
  const brands = new BrandUseCases(brandRepo);
  const categories = new CategoryUseCases(categoryRepo);
  const inventory = new InventoryUseCases(inventoryRepo);
  const contracts = new ContractUseCases(contractRepo);
  const tags = new TagUseCases(tagRepo);
  const coupons = new CouponUseCases(couponRepo);
  const dashboard = new DashboardUseCases(inventoryRepo, orderRepo, contractRepo);

  // 3. Return Facade
  return {
    products,
    orders,
    brands,
    categories,
    inventory,
    contracts,
    tags,
    coupons,
    dashboard,
  };
}
