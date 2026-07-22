export type StockMovementType = 'receive' | 'reserve' | 'release' | 'sale' | 'return' | 'adjustment';

export interface StockMovement {
  id: string;
  productVariantId: string;
  movementType: StockMovementType;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  note?: string;
  createdAt: string;
}
