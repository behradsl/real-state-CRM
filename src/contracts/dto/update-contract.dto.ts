import { ApiPropertyOptional } from '@nestjs/swagger';
import { ContractType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { saleTermsExample } from '../../common/swagger/json-examples';

export class UpdateContractDto {
  @ApiPropertyOptional({ enum: ContractType, example: ContractType.SALE })
  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @ApiPropertyOptional({ example: 'CNT-2026-001' })
  @IsOptional()
  @IsString()
  contractNumber?: string;

  @ApiPropertyOptional({ example: 'مبایعه نامه آپارتمان' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  commissionPercentage?: number;

  @ApiPropertyOptional({ example: 225000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  commissionAmount?: number;

  @ApiPropertyOptional({ example: 9 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxPercentage?: number;

  @ApiPropertyOptional({ example: 20250000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiPropertyOptional({ example: 0.75 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  firstPartyCommissionPercentage?: number;

  @ApiPropertyOptional({ example: 112500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  firstPartyCommissionAmount?: number;

  @ApiPropertyOptional({ example: 0.75 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  secondPartyCommissionPercentage?: number;

  @ApiPropertyOptional({ example: 112500000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  secondPartyCommissionAmount?: number;

  @ApiPropertyOptional({ example: 15000000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional({ example: 100000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyAmount?: number;

  @ApiPropertyOptional({ example: 500000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  officialDeedDate?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description:
      'Frontend-owned terms by contract type. Shape is not validated by the API.',
    example: saleTermsExample,
  })
  @IsOptional()
  @IsObject()
  termsAndConditions?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-03-20T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  signedAt?: string;
}
