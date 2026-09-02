import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  organizationId!: string | null;

  @ApiProperty({ format: 'uuid' })
  uploadedById!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    description: 'Private storage key under uploads/ (not a public URL)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf',
  })
  path!: string;

  @ApiProperty({ example: 'application/pdf' })
  contentType!: string;

  @ApiProperty({ example: 2048 })
  size!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
