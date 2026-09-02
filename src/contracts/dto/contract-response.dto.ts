import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ContractLawyerSide,
  ContractPartyRole,
  ContractType,
} from '@prisma/client';
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

export class ContractLawyerResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  contractId!: string;

  @ApiProperty({ enum: ContractLawyerSide })
  side!: ContractLawyerSide;

  @ApiPropertyOptional({ nullable: true })
  name!: string | null;

  @ApiPropertyOptional({ nullable: true })
  fatherName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  identityNumber!: string | null;

  @ApiPropertyOptional({ nullable: true })
  birthPlace!: string | null;

  @ApiPropertyOptional({ nullable: true })
  birthDate!: string | null;

  @ApiPropertyOptional({ nullable: true })
  identityExportPlace!: string | null;

  @ApiPropertyOptional({ nullable: true })
  nationalCode!: string | null;

  @ApiPropertyOptional({ nullable: true })
  address!: string | null;

  @ApiPropertyOptional({ nullable: true })
  postalCode!: string | null;

  @ApiPropertyOptional({ nullable: true })
  cause!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
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

  @ApiPropertyOptional({ nullable: true, example: '1404/01/10' })
  contractDate!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '11:30' })
  contractTime!: string | null;

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

  @ApiPropertyOptional({ nullable: true })
  commissionCityRules!: string | null;

  @ApiPropertyOptional({ nullable: true })
  commissionFactorNumber!: string | null;

  @ApiPropertyOptional({ nullable: true })
  firstPartyFactorNumber!: string | null;

  @ApiPropertyOptional({ nullable: true })
  secondPartyFactorNumber!: string | null;

  @ApiPropertyOptional({ nullable: true })
  notes!: string | null;

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
    description: '@deprecated Prefer typed *Details relations',
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

  @ApiPropertyOptional({ type: [ContractLawyerResponseDto] })
  lawyers?: ContractLawyerResponseDto[];

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  saleDetails?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  rentDetails?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  goodwillDetails?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  preSaleDetails?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  rescissionDetails?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
  })
  cjvDetails?: Record<string, unknown> | null;
}
