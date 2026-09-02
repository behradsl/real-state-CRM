import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class LawyerDto {
  @ApiPropertyOptional({ example: 'رضا وکیل' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'علی' })
  @IsOptional()
  @IsString()
  fatherName?: string;

  @ApiPropertyOptional({ example: '123456' })
  @IsOptional()
  @IsString()
  identityNumber?: string;

  @ApiPropertyOptional({ example: 'همدان' })
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiPropertyOptional({ example: '1370/01/01' })
  @IsOptional()
  @IsString()
  birthDate?: string;

  @ApiPropertyOptional({ example: 'همدان' })
  @IsOptional()
  @IsString()
  identityExportPlace?: string;

  @ApiPropertyOptional({ example: '0012345678' })
  @IsOptional()
  @IsString()
  nationalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '6513112345' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'وکالت‌نامه رسمی' })
  @IsOptional()
  @IsString()
  cause?: string;
}

export class ContractLawyersDto {
  @ApiPropertyOptional({ type: LawyerDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LawyerDto)
  firstParty?: LawyerDto;

  @ApiPropertyOptional({ type: LawyerDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LawyerDto)
  secondParty?: LawyerDto;
}

export class SaleDetailsDto {
  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  shareUnits?: number;

  @ApiPropertyOptional({ example: 125000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerSqm?: number;

  @ApiPropertyOptional({ example: 15000000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional({ example: 'پانزده میلیارد ریال' })
  @IsOptional()
  @IsString()
  totalInWords?: string;

  @ApiPropertyOptional({ example: 2000000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prePaymentAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentChequeNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentBankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentBankBranch?: string;

  @ApiPropertyOptional({ example: 13000000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  remainderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voucherRegistrationDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voucherOrganizationNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cancelationPenalty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  breachPenalty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notaryFeePayer?: string;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  delayPenaltyFirstPartyPerDay?: number;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  delayPenaltySecondPartyPerDay?: number;
}

export class RentDetailsDto {
  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  shareUnits?: number;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  durationMonths?: number;

  @ApiPropertyOptional({ example: '1404/01/01' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '1405/01/01' })
  @IsOptional()
  @IsString()
  toDate?: string;

  @ApiPropertyOptional({ example: 100000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  monthlyInWords?: string;

  @ApiPropertyOptional({ example: 500000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  mortgageAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mortgageInWords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  totalInWords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prePaymentAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentChequeNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentBankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentBankBranch?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  remainderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remainderDueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cancelationPenalty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  breachPenalty?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notaryFeePayer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  delayPenaltyFirstPartyPerDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  delayPenaltySecondPartyPerDay?: number;

  @ApiPropertyOptional({ description: 'Print property.ownerName' })
  @IsOptional()
  @IsString()
  propertyOwnerName?: string;
}

export class GoodwillDetailsDto {
  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  shareUnits?: number;

  @ApiPropertyOptional({ example: 80000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerSqm?: number;

  @ApiPropertyOptional({ example: 8000000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  prePaymentAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentChequeNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentBankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prePaymentBankBranch?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  remainderAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  remainderDueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  penaltyAmount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryDate?: string;
}

export class PreSaleDetailsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  renovationCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  technicalIdNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  insuranceNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buildingPermitNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buildingPermitDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  equipped?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  totalFloors?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  totalUnits?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaSqm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  storage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orientation?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parkingNumberAndArea?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  flooringType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cabinetAndFaucetType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bathroomType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  switchOutletType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  entranceDoorType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  interiorDoorType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ceilingPlasterType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  emergencyWaterSourceType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  heatingType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coolerType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  intercomType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cctv?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tilingType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  windowType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  facadeType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parkingFloorWallCover?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lighting?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  balconyCorridorRailing?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fireExtinguisher?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  elevator?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  waterMotor?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  utilitiesScore?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  loan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  loanType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  loanInstallmentAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  totalInWords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deedTransferDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  selfDeclareFormNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voucherOrganizationNumber?: string;
}

export class MutualRescissionDetailsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalContractNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalContractDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  originalAgencyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  shareUnits?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaSqm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  county?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownershipNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aggregationClause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryClause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentType?: string;
}

export class ConstructionJvDetailsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  propertyDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  shareUnits?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaSqm?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  totalInWords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  governmentalCosts?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  constructionCosts?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  facilityRightsCosts?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  destructionCost?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstPartyShare?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondPartyShare?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDateInWords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDateInWords?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  costDetailsPrepareDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  voucherTransferDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  shareUnitsToTransfer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  delayPenaltyFirstPartyPerDay?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  delayPenaltySecondPartyPerDay?: number;
}
