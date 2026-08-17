import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiPropertyOptional({
    format: 'uuid',
    description:
      'Organization this user belongs to. Required for ADMIN when creating non-admin users. Ignored for OWNER (forced to their org). Omit when ADMIN creates another ADMIN.',
  })
  @IsOptional()
  @IsUUID()
  organizationId?: string;

  @ApiProperty({ example: 'agent@agency.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    minLength: 8,
    example: 'password123',
    description: 'Plain password; stored as a bcrypt hash',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 'Ali' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Rezaei' })
  @IsString()
  lastName!: string;

  @ApiPropertyOptional({ example: '09120000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    enum: UserRole,
    default: UserRole.AGENT,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
