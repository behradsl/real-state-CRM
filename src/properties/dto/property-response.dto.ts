import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PropertyType } from '@prisma/client';
import { AddressResponseDto } from '../../common/dto/address-response.dto';
import { OtherFacilityDto } from './create-property.dto';

export class DeedInfoResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  propertyId!: string;

  @ApiPropertyOptional({ nullable: true, example: '12345/67' })
  cadastralNumber!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '67' })
  subParcelNumber!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '12345' })
  mainParcelNumber!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '12' })
  plotNumber!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '11' })
  cadastralDistrict!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'همدان' })
  registrationArea!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 120.5 })
  areaSqm!: number | null;

  @ApiPropertyOptional({ nullable: true, example: '6513112345' })
  postalCode!: string | null;

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

  @ApiPropertyOptional({ nullable: true, example: true })
  water!: boolean | null;

  @ApiPropertyOptional({ nullable: true, example: true })
  electricity!: boolean | null;

  @ApiPropertyOptional({ nullable: true, example: true })
  gas!: boolean | null;

  @ApiPropertyOptional({ nullable: true, example: false })
  telephone!: boolean | null;

  @ApiPropertyOptional({ nullable: true, example: true })
  parking!: boolean | null;

  @ApiPropertyOptional({ nullable: true, example: 1 })
  parkingCount!: number | null;

  @ApiPropertyOptional({ nullable: true, example: true })
  storage!: boolean | null;

  @ApiPropertyOptional({ nullable: true, example: 1 })
  storageCount!: number | null;

  @ApiPropertyOptional({ nullable: true, example: 15 })
  storageArea!: number | null;

  @ApiPropertyOptional({ nullable: true, example: true })
  elevator!: boolean | null;

  @ApiPropertyOptional({
    type: [OtherFacilityDto],
    nullable: true,
    example: [
      { name: 'گرمایش', kind: 'گرمایش از کف' },
      { name: 'کابینت', kind: 'MDF' },
    ],
  })
  otherFacilities!: OtherFacilityDto[] | null;

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
