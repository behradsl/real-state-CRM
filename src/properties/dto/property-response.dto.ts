import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import { AddressResponseDto } from '../../common/dto/address-response.dto';
import {
  deedInfoExample,
  facilitiesExample,
} from '../../common/swagger/json-examples';

export class DeedInfoResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  propertyId!: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description: 'Frontend-owned deed payload',
    example: deedInfoExample,
  })
  data!: Record<string, unknown>;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}

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

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  addressId!: string | null;

  @ApiPropertyOptional({ type: AddressResponseDto, nullable: true })
  address!: AddressResponseDto | null;

  @ApiPropertyOptional({ nullable: true })
  areaSqm!: number | null;

  @ApiPropertyOptional({ nullable: true })
  floor!: number | null;

  @ApiPropertyOptional({ nullable: true })
  totalFloors!: number | null;

  @ApiPropertyOptional({ nullable: true })
  yearBuilt!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bedrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  bathrooms!: number | null;

  @ApiPropertyOptional({ nullable: true })
  parkingSpots!: number | null;

  @ApiPropertyOptional({ nullable: true })
  furnished!: boolean | null;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    nullable: true,
    example: facilitiesExample,
  })
  facilities!: Record<string, unknown> | null;

  @ApiPropertyOptional({ nullable: true })
  referenceCode!: string | null;

  @ApiPropertyOptional({ type: DeedInfoResponseDto, nullable: true })
  deedInfo!: DeedInfoResponseDto | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
