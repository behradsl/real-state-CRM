import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContractType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { saleTermsExample } from '../../common/swagger/json-examples';
import {
  ContractPartyInputDto,
  ContractPropertyInputDto,
} from './contract-nested.dto';
import {
  ConstructionJvDetailsDto,
  ContractLawyersDto,
  GoodwillDetailsDto,
  MutualRescissionDetailsDto,
  PreSaleDetailsDto,
  RentDetailsDto,
  SaleDetailsDto,
} from './typed-details.dto';

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

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Link existing property. Required unless `property` is provided.',
  })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiPropertyOptional({
    type: ContractPropertyInputDto,
    description:
      'Create or patch property then link. Prefer over propertyId when both set with nested id.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContractPropertyInputDto)
  property?: ContractPropertyInputDto;

  @ApiPropertyOptional({ example: 'مبایعه نامه آپارتمان' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '1404/01/10' })
  @IsOptional()
  @IsString()
  contractDate?: string;

  @ApiPropertyOptional({ example: '11:30' })
  @IsOptional()
  @IsString()
  contractTime?: string;

  @ApiPropertyOptional({ example: 'تعرفه اتحادیه همدان' })
  @IsOptional()
  @IsString()
  commissionCityRules?: string;

  @ApiPropertyOptional({ example: 'F-1001' })
  @IsOptional()
  @IsString()
  commissionFactorNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstPartyFactorNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondPartyFactorNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

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

  @ApiPropertyOptional({
    example: 15000000000,
    description: 'CRM total price / total rent period amount (rials)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional({
    example: 100000000,
    description: 'CRM monthly rent amount (rials)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyAmount?: number;

  @ApiPropertyOptional({
    example: 500000000,
    description: 'CRM deposit / security amount (rials)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Contract / lease start date',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Contract / lease end date',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Property delivery date',
  })
  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    description: 'Official deed / notary transfer date',
  })
  @IsOptional()
  @IsDateString()
  officialDeedDate?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description:
      '@deprecated Prefer typed *Details. Still accepted; mapped into details when typed details are missing.',
    example: saleTermsExample,
  })
  @IsOptional()
  @IsObject()
  termsAndConditions?: Record<string, unknown>;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Required unless `firstParty` nested object is provided.',
  })
  @IsOptional()
  @IsUUID()
  firstPartyId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Required unless `secondParty` nested object is provided.',
  })
  @IsOptional()
  @IsUUID()
  secondPartyId?: string;

  @ApiPropertyOptional({
    type: [String],
    format: 'uuid',
    description: 'Optional witness party ids',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  witnessIds?: string[];

  @ApiPropertyOptional({ type: ContractPartyInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContractPartyInputDto)
  firstParty?: ContractPartyInputDto;

  @ApiPropertyOptional({ type: ContractPartyInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContractPartyInputDto)
  secondParty?: ContractPartyInputDto;

  @ApiPropertyOptional({ type: [ContractPartyInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractPartyInputDto)
  witnesses?: ContractPartyInputDto[];

  @ApiPropertyOptional({ type: ContractLawyersDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContractLawyersDto)
  lawyers?: ContractLawyersDto;

  @ApiPropertyOptional({ type: SaleDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SaleDetailsDto)
  saleDetails?: SaleDetailsDto;

  @ApiPropertyOptional({ type: RentDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RentDetailsDto)
  rentDetails?: RentDetailsDto;

  @ApiPropertyOptional({ type: GoodwillDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GoodwillDetailsDto)
  goodwillDetails?: GoodwillDetailsDto;

  @ApiPropertyOptional({ type: PreSaleDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PreSaleDetailsDto)
  preSaleDetails?: PreSaleDetailsDto;

  @ApiPropertyOptional({ type: MutualRescissionDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MutualRescissionDetailsDto)
  rescissionDetails?: MutualRescissionDetailsDto;

  @ApiPropertyOptional({ type: ConstructionJvDetailsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConstructionJvDetailsDto)
  cjvDetails?: ConstructionJvDetailsDto;
}
