import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    nullable: true,
    description: 'Null only for platform ADMIN users',
  })
  organizationId!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Present for organization users; null for platform ADMIN',
    example: { id: '…', name: 'آژانس نمونه', slug: 'namoneh' },
  })
  organization!: {
    id: string;
    name: string;
    slug: string;
  } | null;

  @ApiProperty({ example: 'agent@agency.com' })
  email!: string;

  @ApiProperty({ example: 'Ali' })
  firstName!: string;

  @ApiProperty({ example: 'Rezaei' })
  lastName!: string;

  @ApiPropertyOptional({ example: '09120000000', nullable: true })
  phone!: string | null;

  @ApiProperty({ enum: UserRole, example: UserRole.AGENT })
  role!: UserRole;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
