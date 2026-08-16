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
import { ClientsService } from './clients.service';
import { ClientResponseDto } from './dto/client-response.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@ApiTags('Clients')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('clients')
@UseGuards(SessionAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create client',
    description:
      'Creates a contact. Non-admins are scoped to their organization. ownerId defaults to the current user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Client created',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Not allowed to assign org/owner' })
  create(
    @CurrentUser() actor: PublicUser,
    @Body() createClientDto: CreateClientDto,
  ) {
    return this.clientsService.create(actor, createClientDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List clients',
    description:
      'Admin: all. Owner: organization clients. Others: clients they own.',
  })
  @ApiResponse({
    status: 200,
    description: 'Visible clients',
    type: [ClientResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  findAll(@CurrentUser() actor: PublicUser) {
    return this.clientsService.findAll(actor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Client found',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to this client' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.clientsService.findOne(actor, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update client',
    description: 'Reassigning ownerId is limited to ADMIN and OWNER.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Client updated',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to update this client' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  update(
    @CurrentUser() actor: PublicUser,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(actor, id, updateClientDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft-delete client',
    description: 'Sets deletedAt; excluded from list/get afterwards.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Client soft-deleted',
    type: ClientResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to delete this client' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  remove(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.clientsService.remove(actor, id);
  }
}
