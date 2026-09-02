import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from '../../common/dto/create-address.dto';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({ example: 'Acme Realty' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'acme-realty' })
  @IsOptional()
  @IsString()
  slug?: string;

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
}
