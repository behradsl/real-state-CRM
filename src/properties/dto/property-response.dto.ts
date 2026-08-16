import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ListingType,
  PropertyStatus,
  PropertyType,
} from '@prisma/client';

export class PropertyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ format: 'uuid' })
  ownerId!: string;

  @ApiProperty()
  title!: string;

  @ApiPropertyOptional({ nullable: true })
  description!: string | null;

  @ApiProperty({ enum: PropertyType })
  propertyType!: PropertyType;

  @ApiProperty({ enum: ListingType })
  listingType!: ListingType;

  @ApiProperty({ enum: PropertyStatus })
  status!: PropertyStatus;

  @ApiProperty()
  address!: string;

  @ApiProperty()
  city!: string;

  @ApiPropertyOptional({ nullable: true })
  district!: string | null;

  @ApiProperty()
  country!: string;

  @ApiPropertyOptional({ nullable: true })
  postalCode!: string | null;

  @ApiPropertyOptional({ nullable: true })
  latitude!: number | null;

  @ApiPropertyOptional({ nullable: true })
  longitude!: number | null;

  @ApiProperty({
    description: 'Decimal serialized as string',
    example: '15000000000',
  })
  price!: string;

  @ApiProperty()
  currency!: string;

  @ApiPropertyOptional({ nullable: true })
  bedrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bathrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  parkingSpots!: number | null;

  @ApiPropertyOptional({ nullable: true })
  areaSqm!: number | null;

  @ApiPropertyOptional({ nullable: true })
  floor!: number | null;

  @ApiPropertyOptional({ nullable: true })
  totalFloors!: number | null;

  @ApiPropertyOptional({ nullable: true })
  yearBuilt!: number | null;

  @ApiPropertyOptional({ nullable: true })
  furnished!: boolean | null;

  @ApiPropertyOptional({ nullable: true })
  referenceCode!: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  publishedAt!: Date | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
