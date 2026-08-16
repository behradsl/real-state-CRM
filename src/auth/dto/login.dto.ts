import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'acme-realty',
    description: 'Organization slug used at login',
  })
  @IsString()
  organizationSlug!: string;

  @ApiProperty({ example: 'agent@agency.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 8, example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;
}
