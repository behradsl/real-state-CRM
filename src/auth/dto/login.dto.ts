import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({
    example: 'acme-realty',
    description:
      'Organization slug. When omitted, login looks up an active platform ADMIN by email (organizationId null).',
  })
  @IsOptional()
  @IsString()
  organizationSlug?: string;

  @ApiProperty({ example: 'agent@agency.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;
}
