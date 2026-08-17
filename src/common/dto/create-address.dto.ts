import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'Tehran' })
  @IsString()
  province!: string;

  @ApiProperty({ example: 'Tehran' })
  @IsString()
  city!: string;

  @ApiPropertyOptional({ example: 'Valiasr St.' })
  @IsOptional()
  @IsString()
  details?: string;

  @ApiPropertyOptional({ example: '12' })
  @IsOptional()
  @IsString()
  plaque?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 35.6892 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 51.389 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;
}
