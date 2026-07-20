/** AdminBrand domain entity */
export class AdminBrand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null,
    public readonly logoUrl: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: string,
  ) {}

  deactivate(): AdminBrand {
    return new AdminBrand(
      this.id, this.name, this.slug,
      this.description, this.logoUrl, false, this.createdAt,
    );
  }

  activate(): AdminBrand {
    return new AdminBrand(
      this.id, this.name, this.slug,
      this.description, this.logoUrl, true, this.createdAt,
    );
  }
}
