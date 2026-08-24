import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class OtherFacilityDto {
  @ApiProperty({ example: 'گرمایش' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'گرمایش از کف' })
  @IsString()
  kind!: string;
}

export class CreateDeedInfoDto {
  @ApiPropertyOptional({ example: '12345/67' })
  @IsOptional()
  @IsString()
  cadastralNumber?: string;

  @ApiPropertyOptional({ example: '67' })
  @IsOptional()
  @IsString()
  subParcelNumber?: string;

  @ApiPropertyOptional({ example: '12345' })
  @IsOptional()
  @IsString()
  mainParcelNumber?: string;

  @ApiPropertyOptional({ example: '12' })
  @IsOptional()
  @IsString()
  plotNumber?: string;

  @ApiPropertyOptional({ example: '11' })
  @IsOptional()
  @IsString()
  cadastralDistrict?: string;

  @ApiPropertyOptional({ example: 'همدان' })
  @IsOptional()
  @IsString()
  registrationArea?: string;

  @ApiPropertyOptional({ example: 120.5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaSqm?: number;

  @ApiPropertyOptional({ example: '6513112345' })
  @IsOptional()
  @IsString()
  postalCode?: string;
}

export class CreatePropertyDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Required for ADMIN. Ignored for other roles (own org).',
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Assigned agent. Defaults to current user. ADMIN/OWNER may assign another user.',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiProperty({ example: '2BR apartment in Vanak' })
  @IsString()
  title!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PropertyType, example: PropertyType.APARTMENT })
  @IsEnum(PropertyType)
  propertyType!: PropertyType;

  @ApiPropertyOptional({ type: CreateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  addressId?: string;

  @ApiPropertyOptional({ example: 95 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  areaSqm?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  floor?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalFloors?: number;

  @ApiPropertyOptional({ example: 2018 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yearBuilt?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  parkingSpots?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  furnished?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  water?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  electricity?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  gas?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  telephone?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  parking?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  parkingCount?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  storage?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  storageCount?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  storageArea?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  elevator?: boolean;

  @ApiPropertyOptional({
    type: [OtherFacilityDto],
    example: [
      { name: 'گرمایش', kind: 'گرمایش از کف' },
      { name: 'کابینت', kind: 'MDF' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtherFacilityDto)
  otherFacilities?: OtherFacilityDto[];

  @ApiPropertyOptional({ example: 'APT-1001' })
  @IsOptional()
  @IsString()
  referenceCode?: string;

  @ApiPropertyOptional({ type: CreateDeedInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDeedInfoDto)
  deedInfo?: CreateDeedInfoDto;
}
