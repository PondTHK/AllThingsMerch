import { describe, it, expect } from 'vitest';
import { useTagStore } from '@/lib/authenticity/useTagStore';

describe('1-to-1 Authenticity TAG Provenance & Registry Engine', () => {
  it('verifies default demo tag successfully', () => {
    const store = useTagStore.getState();
    const tag = store.verifyTag('DEMO-TAG-2026');

    expect(tag).toBeDefined();
    expect(tag?.brandName).toBe('Oracle Red Bull Racing');
    expect(tag?.serialNumber).toBe('SN-RBR-00001');
    expect(tag?.status).toBe('active');
  });

  it('performs case-insensitive verification lookup', () => {
    const store = useTagStore.getState();
    const tag = store.verifyTag('demo-tag-2026');

    expect(tag).toBeDefined();
    expect(tag?.tagCode).toBe('DEMO-TAG-2026');
  });

  it('returns undefined for non-existent tag codes', () => {
    const store = useTagStore.getState();
    const tag = store.verifyTag('INVALID-UNKNOWN-999');

    expect(tag).toBeUndefined();
  });

  it('registers a newly issued 1-to-1 authenticity tag and retrieves it', () => {
    const store = useTagStore.getState();
    const initialCount = store.tags.length;

    const newTag = store.registerTag({
      tagCode: 'TEST-TAG-2026-001',
      serialNumber: 'SN-TEST-00001',
      productId: 'p-test',
      productName: 'Test Merch Cap',
      brandName: 'Test F1 Team',
      sku: 'TEST-CAP-01',
      status: 'active',
      issuedAt: new Date().toISOString(),
    });

    expect(newTag.tagCode).toBe('TEST-TAG-2026-001');
    expect(useTagStore.getState().tags.length).toBe(initialCount + 1);

    const lookedUp = useTagStore.getState().verifyTag('TEST-TAG-2026-001');
    expect(lookedUp?.serialNumber).toBe('SN-TEST-00001');
  });

  it('updates authenticity tag status accurately', () => {
    useTagStore.getState().updateTagStatus('TEST-TAG-2026-001', 'flagged');
    const updated = useTagStore.getState().verifyTag('TEST-TAG-2026-001');

    expect(updated?.status).toBe('flagged');
  });
});
