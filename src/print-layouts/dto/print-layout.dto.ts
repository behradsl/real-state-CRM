import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContractType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class PrintPointDto {
  @ApiProperty({ example: 40, description: 'mm from left (bottom-left origin)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  x!: number;

  @ApiProperty({ example: 300, description: 'mm from bottom (bottom-left origin)' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  y!: number;

  @ApiPropertyOptional({ example: 1, description: '1-based page index' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;
}

export class PrintFieldBoxDto {
  @ApiProperty({ type: PrintPointDto })
  @ValidateNested()
  @Type(() => PrintPointDto)
  start!: PrintPointDto;

  @ApiProperty({ type: PrintPointDto })
  @ValidateNested()
  @Type(() => PrintPointDto)
  end!: PrintPointDto;
}

export class UpsertPrintLayoutDto {
  @ApiPropertyOptional({
    example: 297,
    description: 'Paper width in mm (A3 portrait default 297)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  paperWidthMm?: number;

  @ApiPropertyOptional({
    example: 420,
    description: 'Paper height in mm (A3 portrait default 420)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  paperHeightMm?: number;

  @ApiProperty({
    description:
      'Map of fieldKey → { start, end } in mm from bottom-left. Keys must be in the catalog for this contract type.',
    example: {
      'firstParty.name': {
        start: { x: 40, y: 350, page: 1 },
        end: { x: 120, y: 358, page: 1 },
      },
    },
  })
  @IsObject()
  fields!: Record<string, PrintFieldBoxDto>;
}

export class PrintLayoutResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  organizationId!: string;

  @ApiProperty({ enum: ContractType })
  contractType!: ContractType;

  @ApiProperty({ example: 297 })
  paperWidthMm!: number;

  @ApiProperty({ example: 420 })
  paperHeightMm!: number;

  @ApiProperty({ type: 'object', additionalProperties: true })
  fields!: Record<string, PrintFieldBoxDto>;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;
}
