import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientType, Gender, PropertyType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateClientDto {
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

  @ApiPropertyOptional({ enum: ClientType })
  @IsOptional()
  @IsEnum(ClientType)
  type?: ClientType;

  @ApiProperty({ example: 'Sara' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Ahmadi' })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ example: 'sara@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '09120000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Tehran' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'referral' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ example: 5000000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMin?: number;

  @ApiPropertyOptional({ example: 12000000000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  budgetMax?: number;

  @ApiPropertyOptional({
    type: [String],
    example: ['Tehran', 'Karaj'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCities?: string[];

  @ApiPropertyOptional({
    enum: PropertyType,
    isArray: true,
    example: [PropertyType.APARTMENT],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(PropertyType, { each: true })
  preferredTypes?: PropertyType[];
}
