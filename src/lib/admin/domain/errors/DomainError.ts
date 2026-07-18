/**
 * Base class for all domain-level errors in the Admin bounded context.
 * These are intentional, named errors — not infrastructure failures.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Specific Domain Errors ───────────────────────────────────────────────────

export class ProductNotFoundError extends DomainError {
  readonly code = 'PRODUCT_NOT_FOUND';
  constructor(id: string) {
    super(`Product with id "${id}" was not found.`);
  }
}

export class OrderNotFoundError extends DomainError {
  readonly code = 'ORDER_NOT_FOUND';
  constructor(orderNumber: string) {
    super(`Order "${orderNumber}" was not found.`);
  }
}

export class InvalidStatusTransitionError extends DomainError {
  readonly code = 'INVALID_STATUS_TRANSITION';
  constructor(from: string, to: string) {
    super(`Cannot transition status from "${from}" to "${to}".`);
  }
}

export class InsufficientStockError extends DomainError {
  readonly code = 'INSUFFICIENT_STOCK';
  constructor(variantId: string, requested: number, available: number) {
    super(
      `Insufficient stock for variant "${variantId}": requested ${requested}, available ${available}.`
    );
  }
}

export class DuplicateSlugError extends DomainError {
  readonly code = 'DUPLICATE_SLUG';
  constructor(slug: string) {
    super(`A product with slug "${slug}" already exists.`);
  }
}

export class ValidationError extends DomainError {
  readonly code = 'VALIDATION_ERROR';
  readonly field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

export class RepositoryError extends DomainError {
  readonly code = 'REPOSITORY_ERROR';
  readonly cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.cause = cause;
  }
}
