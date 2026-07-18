/** AdminCategory domain entity */
export class AdminCategory {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly parentId: string | null,
    public readonly createdAt: string,
  ) {}

  get isRoot(): boolean {
    return this.parentId === null;
  }
}
