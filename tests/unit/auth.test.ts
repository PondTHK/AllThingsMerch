import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/lib/auth/useAuthStore';

describe('Auth & Account Store (Demo Mode)', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  it('performs instant demo collector login', () => {
    useAuthStore.getState().loginAsDemoCollector();
    const user = useAuthStore.getState().user;

    expect(user).toBeDefined();
    expect(user?.role).toBe('customer');
    expect(user?.email).toBe('collector@allthingsmerch.demo');
  });

  it('performs instant demo admin login', () => {
    useAuthStore.getState().loginAsDemoAdmin();
    const user = useAuthStore.getState().user;

    expect(user).toBeDefined();
    expect(user?.role).toBe('admin');
    expect(user?.email).toBe('admin@allthingsmerch.demo');
  });

  it('adds and sets default saved address correctly', () => {
    const store = useAuthStore.getState();
    const initialCount = store.addresses.length;

    const added = store.addAddress({
      label: 'Secondary Condo',
      fullName: 'Test Collector',
      email: 'test@allthingsmerch.demo',
      phone: '081-222-3333',
      street: '456 Sathorn Road',
      city: 'Bangkok',
      postalCode: '10120',
      isDefault: true,
    });

    expect(added.id).toBeDefined();
    const updatedAddresses = useAuthStore.getState().addresses;
    expect(updatedAddresses.length).toBe(initialCount + 1);

    const defaultAddress = updatedAddresses.find((a) => a.isDefault);
    expect(defaultAddress?.id).toBe(added.id);
  });
});
