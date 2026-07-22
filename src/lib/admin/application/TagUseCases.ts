import { AdminTag } from '../domain/entities/AdminTag';
import { IAdminTagRepository, GenerateTagInput } from '../ports/outbound/IAdminTagRepository';
import { PaginationParams, PaginatedResult } from '../ports/outbound/IAdminProductRepository';

export class TagUseCases {
  constructor(private readonly repo: IAdminTagRepository) {}

  async listTags(params: PaginationParams): Promise<PaginatedResult<AdminTag>> {
    return this.repo.findAll(params);
  }

  async generateTag(input: GenerateTagInput): Promise<AdminTag> {
    return this.repo.generate(input);
  }

  async revokeTag(id: string): Promise<void> {
    return this.repo.updateStatus(id, 'revoked');
  }

  async flagTag(id: string): Promise<void> {
    return this.repo.updateStatus(id, 'flagged');
  }
}
