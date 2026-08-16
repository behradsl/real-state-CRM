import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClientType, Gender, PropertyType } from '@prisma/client';

export class ClientResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ format: 'uuid' })
  ownerId!: string;

  @ApiPropertyOptional({ enum: ClientType, nullable: true })
  type!: ClientType | null;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiPropertyOptional({ enum: Gender, nullable: true })
  gender!: Gender | null;

  @ApiPropertyOptional({ nullable: true })
  email!: string | null;

  @ApiPropertyOptional({ nullable: true })
  phone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  secondaryPhone!: string | null;

  @ApiPropertyOptional({ nullable: true })
  company!: string | null;

  @ApiPropertyOptional({ nullable: true })
  address!: string | null;

  @ApiPropertyOptional({ nullable: true })
  city!: string | null;

  @ApiPropertyOptional({ nullable: true })
  notes!: string | null;

  @ApiPropertyOptional({ nullable: true })
  source!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Decimal serialized as string',
    example: '5000000000',
  })
  budgetMin!: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Decimal serialized as string',
    example: '12000000000',
  })
  budgetMax!: string | null;

  @ApiProperty({ type: [String] })
  preferredCities!: string[];

  @ApiProperty({ enum: PropertyType, isArray: true })
  preferredTypes!: PropertyType[];

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  deletedAt!: Date | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
