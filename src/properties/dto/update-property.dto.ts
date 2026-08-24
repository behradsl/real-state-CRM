import { ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from '../../common/dto/create-address.dto';
import {
  CreateDeedInfoDto,
  OtherFacilityDto,
} from './create-property.dto';

export class UpdatePropertyDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Reassign agent. ADMIN/OWNER only.',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({ example: '2BR apartment in Vanak' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: PropertyType })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @ApiPropertyOptional({ type: CreateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  addressId?: string;

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
  floor?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalFloors?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearBuilt?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  parkingSpots?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  furnished?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  water?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  electricity?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  gas?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  telephone?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  parking?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  parkingCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  storage?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  storageCount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  storageArea?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  elevator?: boolean;

  @ApiPropertyOptional({ type: [OtherFacilityDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherFacilityDto)
  otherFacilities?: OtherFacilityDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceCode?: string;

  @ApiPropertyOptional({ type: CreateDeedInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDeedInfoDto)
  deedInfo?: CreateDeedInfoDto;
}
