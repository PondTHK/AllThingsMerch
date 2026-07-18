/** AdminContract domain entity for IP License Contracts */
export type ContractStatusValue = 'active' | 'expired' | 'suspended';

export class AdminContract {
  constructor(
    public readonly id: string,
    public readonly licenseHolderId: string,
    public readonly holderName: string,
    public readonly contractReference: string,
    /** Royalty rate as a decimal percentage e.g. 12.5 means 12.5% */
    public readonly royaltyRate: number,
    public readonly startsAt: string,
    public readonly expiresAt: string,
    private readonly _status: ContractStatusValue,
  ) {}

  get status(): ContractStatusValue {
    return this._status;
  }

  get isActive(): boolean {
    return this._status === 'active';
  }

  /** Returns royalty amount for a given revenue figure */
  calculateRoyalty(revenue: number): number {
    return revenue * (this.royaltyRate / 100);
  }

  get isExpiringSoon(): boolean {
    const diff = new Date(this.expiresAt).getTime() - Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return this._status === 'active' && diff > 0 && diff < thirtyDays;
  }
}
