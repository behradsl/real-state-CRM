import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContractPartyRole, ContractType } from '@prisma/client';
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

  @ApiProperty()
  contractNumber!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
  })
  commissionPercentage!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
  })
  commissionAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
  })
  taxPercentage!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
  })
  taxAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
  })
  firstPartyCommissionPercentage!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
  })
  firstPartyCommissionAmount!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
  })
  secondPartyCommissionPercentage!: string | null;

  @ApiPropertyOptional({
    description: 'Decimal serialized as string',
    nullable: true,
  })
  secondPartyCommissionAmount!: string | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
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
