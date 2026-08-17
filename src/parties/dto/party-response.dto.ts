import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, PartyType } from '@prisma/client';
import { AddressResponseDto } from '../../common/dto/address-response.dto';

export class PartyResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ enum: PartyType, example: PartyType.PERSON })
  type!: PartyType;

  @ApiPropertyOptional({ nullable: true, example: 'علی' })
  firstName!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'محمدی' })
  lastName!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '0012345678' })
  nationalCode!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '12345678901' })
  economicCode!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'شرکت نمونه' })
  companyName!: string | null;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  birthDate!: Date | null;

  @ApiPropertyOptional({ nullable: true, example: 'همدان' })
  birthPlace!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'همدان' })
  identityExportPlace!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'حسین' })
  fatherName!: string | null;

  @ApiPropertyOptional({ nullable: true, example: '123456' })
  identityNumber!: string | null;

  @ApiPropertyOptional({ enum: Gender, nullable: true, example: Gender.MALE })
  gender!: Gender | null;

  @ApiPropertyOptional({ nullable: true, example: '09121234567' })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'ali@example.com' })
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
