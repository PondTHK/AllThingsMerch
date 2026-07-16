export interface StockMovement {
  id: string;
  productVariantId: string;
  movementType: 'receive' | 'reserve' | 'release' | 'sale' | 'return' | 'adjustment';
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  note?: string;
  createdAt: string;
}
