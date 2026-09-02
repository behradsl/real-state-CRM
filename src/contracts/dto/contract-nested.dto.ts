import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreatePartyDto } from '../../parties/dto/create-party.dto';
import { CreatePropertyDto } from '../../properties/dto/create-property.dto';

/** Nested party upsert: with `id` → patch then link; without → create. */
export class ContractPartyInputDto extends PartialType(CreatePartyDto) {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'When set, patch this party then link it',
  })
  @IsOptional()
  @IsUUID()
  id?: string;
}

/** Nested property upsert: with `id` → patch then link; without → create. */
export class ContractPropertyInputDto extends PartialType(CreatePropertyDto) {
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'When set, patch this property then link it',
  })
  @IsOptional()
  @IsUUID()
  id?: string;
}
