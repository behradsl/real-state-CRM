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
