import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContractPartyRole, ContractType, Prisma } from '@prisma/client';

/** Lightweight contract fields embedded on property/party detail responses. */
export const relatedContractSelect = {
  id: true,
  organizationId: true,
  propertyId: true,
  contractType: true,
  contractNumber: true,
  description: true,
  totalAmount: true,
  monthlyAmount: true,
  depositAmount: true,
  signedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ContractSelect;

export type RelatedContractRecord = Prisma.ContractGetPayload<{
  select: typeof relatedContractSelect;
}>;

export class RelatedContractDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ format: 'uuid' })
  propertyId!: string;

  @ApiProperty({ enum: ContractType })
  contractType!: ContractType;

  @ApiProperty()
  contractNumber!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  totalAmount!: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  monthlyAmount!: string | null;

  @ApiPropertyOptional({ nullable: true, type: String })
  depositAmount!: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  signedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}

export class PartyRelatedContractDto extends RelatedContractDto {
  @ApiProperty({ enum: ContractPartyRole })
  role!: ContractPartyRole;
}

function decimalToString(value: Prisma.Decimal | null): string | null {
  return value === null ? null : value.toString();
}

export function toRelatedContract(
  row: RelatedContractRecord,
): RelatedContractDto {
  return {
    id: row.id,
    organizationId: row.organizationId,
    propertyId: row.propertyId,
    contractType: row.contractType,
    contractNumber: row.contractNumber,
    description: row.description,
    totalAmount: decimalToString(row.totalAmount),
    monthlyAmount: decimalToString(row.monthlyAmount),
    depositAmount: decimalToString(row.depositAmount),
    signedAt: row.signedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
