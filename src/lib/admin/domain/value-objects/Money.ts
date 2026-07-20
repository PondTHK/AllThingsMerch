/**
 * Money Value Object
 *
 * Immutable representation of a monetary amount in THB (stored as integer satang).
 * Prevents floating-point arithmetic bugs common in JS financial calculations.
 * Pure TypeScript — no framework dependency.
 */

export class Money {
  /** Amount stored in satang (1 THB = 100 satang) to avoid floats */
  private readonly _satang: number;

  private constructor(satang: number) {
    if (!Number.isInteger(satang) || satang < 0) {
      throw new Error(`Invalid Money amount: ${satang} satang`);
    }
    this._satang = satang;
  }

  /** Create from THB float (e.g. 2990.50) */
  static fromTHB(thb: number): Money {
    return new Money(Math.round(thb * 100));
  }

  /** Create from raw satang integer */
  static fromSatang(satang: number): Money {
    return new Money(satang);
  }

  static zero(): Money {
    return new Money(0);
  }

  get satang(): number {
    return this._satang;
  }

  /** Returns the value as a THB float */
  get thb(): number {
    return this._satang / 100;
  }

  add(other: Money): Money {
    return new Money(this._satang + other._satang);
  }

  subtract(other: Money): Money {
    const result = this._satang - other._satang;
    if (result < 0) throw new Error('Money subtraction resulted in negative amount.');
    return new Money(result);
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this._satang * factor));
  }

  isGreaterThan(other: Money): boolean {
    return this._satang > other._satang;
  }

  isLessThan(other: Money): boolean {
    return this._satang < other._satang;
  }

  equals(other: Money): boolean {
    return this._satang === other._satang;
  }

  /** Format as Thai Baht string e.g. "฿2,990.00" */
  toDisplayString(): string {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(this.thb);
  }
}
