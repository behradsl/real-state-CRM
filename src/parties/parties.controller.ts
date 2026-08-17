import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SESSION_COOKIE_NAME } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PublicUser } from '../users/users.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { PartyResponseDto } from './dto/party-response.dto';
import { UpdatePartyDto } from './dto/update-party.dto';
import { PartiesService } from './parties.service';

@ApiTags('Parties')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('parties')
@UseGuards(SessionAuthGuard, RolesGuard)
export class PartiesController {
  constructor(private readonly partiesService: PartiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create party',
    description:
      'Registers a person or company. Non-admins are scoped to their organization.',
  })
  @ApiResponse({
    status: 201,
    description: 'Party created',
    type: PartyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Not allowed to assign organization' })
  create(
    @CurrentUser() actor: PublicUser,
    @Body() createPartyDto: CreatePartyDto,
  ) {
    return this.partiesService.create(actor, createPartyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List parties',
    description: 'Admin: all. Others: same organization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Visible parties',
    type: [PartyResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  findAll(@CurrentUser() actor: PublicUser) {
    return this.partiesService.findAll(actor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get party by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Party found',
    type: PartyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to this party' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  findOne(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.partiesService.findOne(actor, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update party' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Party updated',
    type: PartyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to update this party' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  update(
    @CurrentUser() actor: PublicUser,
    @Param('id') id: string,
    @Body() updatePartyDto: UpdatePartyDto,
  ) {
    return this.partiesService.update(actor, id, updatePartyDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft-delete party',
    description: 'Sets deletedAt on the party.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Party soft-deleted',
    type: PartyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to delete this party' })
  @ApiResponse({ status: 404, description: 'Party not found' })
  remove(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.partiesService.remove(actor, id);
  }
}
