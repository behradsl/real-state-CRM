import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({
    description: 'Relative storage path or public URL path',
    example: '/uploads/abc.pdf',
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

export class FileUploadResponseDto extends FileResponseDto {
  @ApiPropertyOptional({
    description: 'Use this id as fileId when creating a contract signature',
  })
  declare id: string;
}
