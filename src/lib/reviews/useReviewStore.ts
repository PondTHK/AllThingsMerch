'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Review } from '@/types';

export interface ReviewState {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-f1-redbull-polo',
    userId: 'collector-demo-id',
    orderItemId: 'order-item-mock-1',
    rating: 5,
    comment: 'ผ้าดีมากครับ ลิขสิทธิ์แท้แน่นอน สแกนเช็ค TAG ผ่านฉลุย ทรงสวย ใส่สบาย สมราคา Oracle Red Bull Racing ของแท้ 100%!',
    status: 'published',
    createdAt: '2026-07-10T08:30:00Z',
    userName: 'Demo Collector',
    productName: 'Red Bull Racing 2026 Team Polo',
  },
  {
    id: 'rev-2',
    productId: 'prod-f1-redbull-polo',
    userId: 'user-mock-2',
    orderItemId: 'order-item-mock-2',
    rating: 4,
    comment: 'สีกรมท่าสวยมาก สติกเกอร์สปอนเซอร์เนี้ยบมาก ส่งของไว แต่หัก 1 ดาวเพราะไซซ์ M ค่อนข้างเข้ารูปไปนิดนึงครับ แนะนำสั่งเผื่อไซซ์',
    status: 'published',
    createdAt: '2026-07-12T14:20:00Z',
    userName: 'Kritnat F1 Fan',
    productName: 'Red Bull Racing 2026 Team Polo',
  },
  {
    id: 'rev-3',
    productId: 'prod-f1-ferrari-jacket',
    userId: 'user-mock-3',
    orderItemId: 'order-item-mock-3',
    rating: 5,
    comment: 'แจ็คเก็ต Ferrari สีแดง Rosso Corsa สดใสมาก กันลมกันน้ำได้จริง โค้ด TAG ตรงชายเสื้อสแกนแล้วเจอใบเซอร์ สวยพรีเมียมสมระดับ!',
    status: 'published',
    createdAt: '2026-07-14T09:15:00Z',
    userName: 'Nirin T.',
    productName: 'Scuderia Ferrari 2026 Team Softshell Jacket',
  }
];

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: INITIAL_REVIEWS,

      addReview: (newReview) => {
        const review: Review = {
          ...newReview,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          reviews: [review, ...state.reviews],
        }));
      },

      updateReviewStatus: (id, status) => {
        set((state) => ({
          reviews: state.reviews.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        }));
      },
    }),
    {
      name: 'allthingsmerch-reviews',
    }
  )
);
