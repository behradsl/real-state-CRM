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
  ApiBody,
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
import { createPropertyBodyExample } from '../common/swagger/json-examples';
import { PublicUser } from '../users/users.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyResponseDto } from './dto/property-response.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertiesService } from './properties.service';

@ApiTags('Properties')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('properties')
@UseGuards(SessionAuthGuard, RolesGuard)
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create property',
    description:
      'Creates a property with optional nested address, fixed facility columns, otherFacilities JSON array, and typed deedInfo. Non-admins are scoped to their organization.',
  })
  @ApiBody({
    type: CreatePropertyDto,
    examples: createPropertyBodyExample,
  })
  @ApiResponse({
    status: 201,
    description: 'Property created',
    type: PropertyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Not allowed to assign org/owner' })
  @ApiResponse({
    status: 409,
    description: 'referenceCode already exists in organization',
  })
  create(
    @CurrentUser() actor: PublicUser,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.propertiesService.create(actor, createPropertyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List properties',
    description:
      'Admin: all. Owner: organization properties. Others: properties they own.',
  })
  @ApiResponse({
    status: 200,
    description: 'Visible properties',
    type: [PropertyResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  findAll(@CurrentUser() actor: PublicUser) {
    return this.propertiesService.findAll(actor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Property found',
    type: PropertyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to this property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  findOne(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.propertiesService.findOne(actor, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update property',
    description: 'Reassigning ownerId is limited to ADMIN and OWNER.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Property updated',
    type: PropertyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to update this property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  @ApiResponse({
    status: 409,
    description: 'referenceCode already exists in organization',
  })
  update(
    @CurrentUser() actor: PublicUser,
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(actor, id, updatePropertyDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft-delete property',
    description: 'Sets deletedAt on the property.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Property soft-deleted',
    type: PropertyResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to delete this property' })
  @ApiResponse({ status: 404, description: 'Property not found' })
  remove(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.propertiesService.remove(actor, id);
  }
}
