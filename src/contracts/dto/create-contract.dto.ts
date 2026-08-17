import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContractType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateContractDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Required for ADMIN. Ignored for other roles (own org).',
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiProperty({ enum: ContractType, example: ContractType.SALE })
  @IsEnum(ContractType)
  contractType!: ContractType;

  @ApiProperty({ example: 'CNT-2026-001' })
  @IsString()
  contractNumber!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  propertyId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  commissionPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  commissionAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  firstPartyCommissionPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  firstPartyCommissionAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  secondPartyCommissionPercentage?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  secondPartyCommissionAmount?: number;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description: 'Opaque terms and conditions payload',
  })
  @IsOptional()
  @IsObject()
  termsAndConditions?: Record<string, unknown>;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  firstPartyId!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  secondPartyId!: string;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Optional witness party ids',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  witnessIds?: string[];
}
