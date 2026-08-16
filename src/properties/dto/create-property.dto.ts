import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ListingType,
  PropertyStatus,
  PropertyType,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

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

  @ApiPropertyOptional({ enum: ListingType, default: ListingType.SALE })
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @ApiPropertyOptional({ enum: PropertyStatus, default: PropertyStatus.DRAFT })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  @ApiProperty({ example: 'Valiasr St. 12' })
  @IsString()
  address!: string;

  @ApiProperty({ example: 'Tehran' })
  @IsString()
  city!: string;

  @ApiPropertyOptional({ example: 'Vanak' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: 'Iran', default: 'Iran' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 15000000000, description: 'Price amount' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ example: 'IRR', default: 'IRR' })
  @IsOptional()
  @IsString()
  currency?: string;

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

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  furnished?: boolean;

  @ApiPropertyOptional({ example: 'APT-1001' })
  @IsOptional()
  @IsString()
  referenceCode?: string;
}
