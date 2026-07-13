import { describe, it, expect, beforeEach } from 'vitest';
import { useAdminStore } from '@/lib/admin/useAdminStore';

describe('Admin Store Operations (Catalog, Inventory, Orders, Contracts)', () => {
  beforeEach(() => {
    useAdminStore.setState({
      orders: [],
    });
  });

  it('adds a new catalog product release with initial stock', () => {
    const store = useAdminStore.getState();
    const initialProductCount = store.products.length;

    const newProd = store.addProduct({
      name: 'Test Merch Item',
      slug: 'test-merch-item',
      description: 'Test description',
      brandId: 'b1111111-1111-4111-8111-111111111111',
      categoryId: 'c1111111-1111-4111-8111-111111111111',
      price: 1990,
      sku: 'SKU-TEST-01',
      stockQuantity: 50,
      featuredImage: '/products/polo-navy.jpg',
    });

    expect(newProd.id).toBeDefined();
    expect(useAdminStore.getState().products.length).toBe(initialProductCount + 1);
    expect(newProd.variants[0].stockQuantity).toBe(50);
  });

  it('toggles product status between active and draft', () => {
    const prod = useAdminStore.getState().products[0];
    const initialStatus = prod.status;

    useAdminStore.getState().toggleProductStatus(prod.id);
    const afterFirstToggle = useAdminStore.getState().products.find((p) => p.id === prod.id);
    expect(afterFirstToggle?.status).not.toBe(initialStatus);

    useAdminStore.getState().toggleProductStatus(prod.id);
    const afterSecondToggle = useAdminStore.getState().products.find((p) => p.id === prod.id);
    expect(afterSecondToggle?.status).toBe(initialStatus);
  });

  it('adjusts variant inventory stock quantity accurately and prevents negative stock', () => {
    const prod = useAdminStore.getState().products[0];
    const variant = prod.variants[0];
    const startQty = variant.stockQuantity;

    useAdminStore.getState().adjustVariantStock(variant.id, 10);
    const afterAdd = useAdminStore.getState().products[0].variants[0].stockQuantity;
    expect(afterAdd).toBe(startQty + 10);

    useAdminStore.getState().adjustVariantStock(variant.id, -9999);
    const afterExcessSubtract = useAdminStore.getState().products[0].variants[0].stockQuantity;
    expect(afterExcessSubtract).toBe(0);
  });

  it('registers a new IP licensing agreement', () => {
    const initialContracts = useAdminStore.getState().contracts.length;

    const newContract = useAdminStore.getState().addContract({
      licenseHolderId: 'lh-test',
      holderName: 'Test IP Ltd',
      contractReference: 'TEST-2026-01',
      royaltyRate: 15.0,
      startsAt: '2026-01-01',
      expiresAt: '2027-12-31',
      status: 'active',
    });

    expect(newContract.id).toBeDefined();
    expect(useAdminStore.getState().contracts.length).toBe(initialContracts + 1);
    expect(newContract.royaltyRate).toBe(15.0);
  });
});
