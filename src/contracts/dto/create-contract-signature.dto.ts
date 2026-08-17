import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { signatureDataExample } from '../../common/swagger/json-examples';

export class CreateContractSignatureDto {
  @ApiProperty({
    format: 'uuid',
    example: '22222222-2222-4222-8222-222222222222',
  })
  @IsUUID()
  partyId!: string;

  @ApiPropertyOptional({
    format: 'uuid',
    example: '66666666-6666-4666-8666-666666666666',
  })
  @IsOptional()
  @IsUUID()
  fileId?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description:
      'Frontend-owned signature payload when no file is uploaded yet. Shape is not validated by the API.',
    example: signatureDataExample,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;

  @ApiPropertyOptional({
    type: String,
    format: 'date-time',
    example: '2026-03-20T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  signedAt?: string;
}
