import { describe, it, expect } from 'vitest';
import { roundMoney, formatTHB } from '@/lib/money';

describe('Money Utilities', () => {
  it('rounds currency accurately', () => {
    expect(roundMoney(10.005)).toBe(10.01);
    expect(roundMoney(3490)).toBe(3490);
  });

  it('formats THB currency correctly', () => {
    expect(formatTHB(3490)).toBe('฿3,490');
    expect(formatTHB(120.5)).toBe('฿120.5');
  });
});
