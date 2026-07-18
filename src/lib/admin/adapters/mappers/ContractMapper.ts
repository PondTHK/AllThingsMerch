import { AdminContract, ContractStatusValue } from '../../domain/entities/AdminContract';

export class ContractMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toDomain(row: Record<string, any>): AdminContract {
    return new AdminContract(
      row.id,
      row.license_holder_id ?? '',
      row.holder_name ?? row.license_holders?.name ?? '',
      row.contract_reference ?? '',
      Number(row.royalty_rate) || 0,
      row.starts_at ?? '',
      row.expires_at ?? '',
      (row.status ?? 'active') as ContractStatusValue,
    );
  }
}
