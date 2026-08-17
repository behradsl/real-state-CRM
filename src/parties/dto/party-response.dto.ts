import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, PartyType } from '@prisma/client';
import { AddressResponseDto } from '../../common/dto/address-response.dto';

export class PartyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ enum: PartyType })
  type!: PartyType;

  @ApiPropertyOptional({ nullable: true })
  firstName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  lastName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  nationalCode!: string | null;

  @ApiPropertyOptional({ nullable: true })
  economicCode!: string | null;

  @ApiPropertyOptional({ nullable: true })
  companyName!: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  birthDate!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  birthPlace!: string | null;

  @ApiPropertyOptional({ nullable: true })
  identityExportPlace!: string | null;

  @ApiPropertyOptional({ nullable: true })
  fatherName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  identityNumber!: string | null;

  @ApiPropertyOptional({ enum: Gender, nullable: true })
  gender!: Gender | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  addressId!: string | null;

  @ApiPropertyOptional({ type: AddressResponseDto, nullable: true })
  address!: AddressResponseDto | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
