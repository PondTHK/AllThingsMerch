import { describe, it, expect, beforeEach } from 'vitest';
import { useReviewStore } from '../../src/lib/reviews/useReviewStore';

describe('Reviews & Ratings System', () => {
  beforeEach(() => {
    // Reset Zustand store to initial mock reviews before each test
    useReviewStore.setState({
      reviews: [
        {
          id: 'rev-1',
          productId: 'prod-f1-redbull-polo',
          userId: 'collector-demo-id',
          orderItemId: 'order-item-mock-1',
          rating: 5,
          comment: 'ผ้าดีมากครับ ลิขสิทธิ์แท้แน่นอน',
          status: 'published',
          createdAt: '2026-07-10T08:30:00Z',
          userName: 'Thanakhon Demo Collector',
          productName: 'Red Bull Racing 2026 Team Polo',
        },
        {
          id: 'rev-2',
          productId: 'prod-f1-redbull-polo',
          userId: 'user-mock-2',
          orderItemId: 'order-item-mock-2',
          rating: 4,
          comment: 'สีกรมท่าสวยมาก สติกเกอร์เนี้ยบมาก',
          status: 'published',
          createdAt: '2026-07-12T14:20:00Z',
          userName: 'Kritnat F1 Fan',
          productName: 'Red Bull Racing 2026 Team Polo',
        }
      ]
    });
  });

  it('contains initialized default mock reviews in store', () => {
    const state = useReviewStore.getState();
    expect(state.reviews.length).toBe(2);
    expect(state.reviews[0].id).toBe('rev-1');
  });

  it('successfully submits a new verified customer review', () => {
    const store = useReviewStore.getState();
    store.addReview({
      productId: 'prod-f1-ferrari-jacket',
      userId: 'test-user-id',
      orderItemId: 'order-item-mock-99',
      rating: 5,
      comment: 'เสื้อใส่กระชับ กันลมดีเยี่ยม!',
      status: 'published',
      userName: 'Test Reviewer',
      productName: 'Scuderia Ferrari Jacket',
    });

    const updatedState = useReviewStore.getState();
    expect(updatedState.reviews.length).toBe(3);
    expect(updatedState.reviews[0].comment).toBe('เสื้อใส่กระชับ กันลมดีเยี่ยม!');
    expect(updatedState.reviews[0].userName).toBe('Test Reviewer');
    expect(updatedState.reviews[0].rating).toBe(5);
  });

  it('allows administrator to toggle review visibility to hidden', () => {
    const store = useReviewStore.getState();
    expect(store.reviews[0].status).toBe('published');

    store.updateReviewStatus('rev-1', 'hidden');

    const updatedState = useReviewStore.getState();
    expect(updatedState.reviews[0].status).toBe('hidden');
  });
});
