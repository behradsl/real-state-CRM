import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AddressResponseDto } from '../../common/dto/address-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';

export class OrganizationResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'Acme Realty' })
  name!: string;

  @ApiProperty({ example: 'acme-realty' })
  slug!: string;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true })
  website!: string | null;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  addressId!: string | null;

  @ApiPropertyOptional({ type: AddressResponseDto, nullable: true })
  address?: AddressResponseDto | null;

  @ApiPropertyOptional({
    type: UserResponseDto,
    description: 'Present on create response',
  })
  owner?: UserResponseDto;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
