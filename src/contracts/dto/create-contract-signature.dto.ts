import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsObject,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateContractSignatureDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  partyId!: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  fileId?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    description: 'Opaque signature payload when no file is uploaded yet',
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, unknown>;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  signedAt?: string;
}
