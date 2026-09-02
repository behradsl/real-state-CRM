import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from '../../common/dto/create-address.dto';

export class CreateOrganizationOwnerDto {
  @ApiProperty({ example: 'owner@agency.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'Sara' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Karimi' })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({ example: '09120000000' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CreateOrganizationDto {
  @ApiProperty({ example: 'Acme Realty' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'acme-realty' })
  @IsString()
  slug!: string;

  @ApiPropertyOptional({ example: '02100000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'info@acme.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://acme.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: '۱۲۳۴۵' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({ type: CreateAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiProperty({ type: CreateOrganizationOwnerDto })
  @ValidateNested()
  @Type(() => CreateOrganizationOwnerDto)
  owner!: CreateOrganizationOwnerDto;
}
