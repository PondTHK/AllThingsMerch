/** AdminTag domain entity for Authenticity TAG records */
export type TagStatusValue = 'active' | 'flagged' | 'revoked';

export class AdminTag {
  constructor(
    public readonly id: string,
    public readonly orderItemId: string,
    public readonly publicCode: string,
    public readonly serialNumber: string,
    public readonly productName: string,
    public readonly brandName: string,
    public readonly sku: string,
    public readonly size: string | null,
    private readonly _status: TagStatusValue,
    public readonly issuedAt: string,
    public readonly orderNumber: string | null,
  ) {}

  get status(): TagStatusValue {
    return this._status;
  }

  get isActive(): boolean {
    return this._status === 'active';
  }

  revoke(): AdminTag {
    return new AdminTag(
      this.id, this.orderItemId, this.publicCode, this.serialNumber,
      this.productName, this.brandName, this.sku, this.size,
      'revoked', this.issuedAt, this.orderNumber,
    );
  }

  flag(): AdminTag {
    return new AdminTag(
      this.id, this.orderItemId, this.publicCode, this.serialNumber,
      this.productName, this.brandName, this.sku, this.size,
      'flagged', this.issuedAt, this.orderNumber,
    );
  }
}
