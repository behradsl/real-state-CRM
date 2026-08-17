import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { SESSION_COOKIE_NAME } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PublicUser } from '../users/users.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationResponseDto } from './dto/organization-response.dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('organizations')
@UseGuards(SessionAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create organization with OWNER',
    description:
      'Admin only. Optionally creates an address, then organization and OWNER user in one transaction.',
  })
  @ApiResponse({
    status: 201,
    description: 'Organization and owner created',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Admin only' })
  @ApiResponse({
    status: 409,
    description: 'Slug or owner email conflict',
  })
  create(
    @CurrentUser() actor: PublicUser,
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationsService.create(actor, createOrganizationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({
    summary: 'List organizations',
    description: 'Admin: all. Owner: only their organization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Organizations visible to the current role',
    type: [OrganizationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  findAll(@CurrentUser() actor: PublicUser) {
    return this.organizationsService.findAll(actor);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({
    summary: 'Get organization by id',
    description: 'Admin: any. Owner: their organization only.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Organization found',
    type: OrganizationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to this organization' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findOne(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.organizationsService.findOne(actor, id);
  }
}
