import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContractPartyRole, ContractType } from '@prisma/client';
import {
  saleTermsExample,
  signatureDataExample,
} from '../../common/swagger/json-examples';
import { PartyResponseDto } from '../../parties/dto/party-response.dto';
import { PropertyResponseDto } from '../../properties/dto/property-response.dto';

export class ContractPartyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  contractId!: string;

  @ApiProperty({ format: 'uuid' })
  partyId!: string;

  @ApiProperty({ enum: ContractPartyRole })
  role!: ContractPartyRole;

  @ApiProperty({ type: PartyResponseDto })
  party!: PartyResponseDto;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;
}

export class ContractSignatureResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  contractId!: string;

  @ApiProperty({ format: 'uuid' })
  partyId!: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  fileId!: string | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    example: signatureDataExample,
  })
  data!: Record<string, unknown> | null;

  @ApiProperty({ type: String, format: 'date-time' })
  signedAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;
}

export class ContractResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ format: 'uuid' })
  createdById!: string;

  @ApiProperty({ format: 'uuid' })
  propertyId!: string;

  @ApiProperty({ enum: ContractType })
  contractType!: ContractType;

  @ApiProperty({ example: 'CNT-2026-001' })
  contractNumber!: string;

  @ApiPropertyOptional({ nullable: true, example: 'مبایعه نامه آپارتمان' })
  description!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
    example: '1.5',
  })
  commissionPercentage!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
    example: '225000000',
  })
  commissionAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
    example: '9',
  })
  taxPercentage!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
    example: '20250000',
  })
  taxAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
    example: '0.75',
  })
  firstPartyCommissionPercentage!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
    example: '112500000',
  })
  firstPartyCommissionAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
    example: '0.75',
  })
  secondPartyCommissionPercentage!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
    example: '112500000',
  })
  secondPartyCommissionAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string — total price / period rent',
    nullable: true,
    example: '15000000000',
  })
  totalAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string — monthly rent',
    nullable: true,
    example: '100000000',
  })
  monthlyAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string — deposit / security',
    nullable: true,
    example: '500000000',
  })
  depositAmount!: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  startDate!: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  endDate!: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  deliveryDate!: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  officialDeedDate!: Date | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    example: saleTermsExample,
  })
  termsAndConditions!: Record<string, unknown> | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  signedAt!: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;

  @ApiPropertyOptional({ type: PropertyResponseDto })
  property?: PropertyResponseDto;

  @ApiPropertyOptional({ type: [ContractPartyResponseDto] })
  parties?: ContractPartyResponseDto[];

  @ApiPropertyOptional({ type: [ContractSignatureResponseDto] })
  signatures?: ContractSignatureResponseDto[];
}
