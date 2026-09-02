import { ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  propertyId?: string;

  @ApiPropertyOptional({ type: ContractPropertyInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContractPropertyInputDto)
  property?: ContractPropertyInputDto;

  @ApiPropertyOptional({ example: '1404/01/10' })
  @IsOptional()
  @IsString()
  contractDate?: string;

  @ApiPropertyOptional({ example: '11:30' })
  @IsOptional()
  @IsString()
  contractTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  commissionCityRules?: string;

  @ApiPropertyOptional()
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
      '@deprecated Prefer typed *Details. Mapped into details when typed details missing.',
    example: saleTermsExample,
  })
  @IsOptional()
  @IsObject()
  termsAndConditions?: Record<string, unknown>;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  firstPartyId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  secondPartyId?: string;

  @ApiPropertyOptional({ type: [String], format: 'uuid' })
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

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-03-20T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  signedAt?: string;
}
