import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Put,
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
import { ContractType, UserRole } from '@prisma/client';
import { SESSION_COOKIE_NAME } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PublicUser } from '../users/users.service';
import {
  PrintLayoutResponseDto,
  UpsertPrintLayoutDto,
} from './dto/print-layout.dto';
import { PrintLayoutsService } from './print-layouts.service';

@ApiTags('Print layouts')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('organizations/:organizationId/print-layouts')
@UseGuards(SessionAuthGuard, RolesGuard)
export class PrintLayoutsController {
  constructor(private readonly printLayoutsService: PrintLayoutsService) {}

  @Get('catalog')
  @Roles(
    UserRole.ADMIN,
    UserRole.OWNER,
    UserRole.MANAGER,
    UserRole.AGENT,
    UserRole.ASSISTANT,
  )
  @ApiOperation({
    summary: 'List allowed print field keys per contract type',
  })
  @ApiResponse({ status: 200, description: 'Field key catalog' })
  catalog() {
    return this.printLayoutsService.getCatalog();
  }

  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.OWNER,
    UserRole.MANAGER,
    UserRole.AGENT,
    UserRole.ASSISTANT,
  )
  @ApiOperation({ summary: 'List print layouts for an organization' })
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiResponse({ status: 200, type: [PrintLayoutResponseDto] })
  @ApiForbiddenResponse({ description: 'No access to organization' })
  findAll(
    @CurrentUser() actor: PublicUser,
    @Param('organizationId') organizationId: string,
  ) {
    return this.printLayoutsService.findAll(actor, organizationId);
  }

  @Get(':contractType')
  @Roles(
    UserRole.ADMIN,
    UserRole.OWNER,
    UserRole.MANAGER,
    UserRole.AGENT,
    UserRole.ASSISTANT,
  )
  @ApiOperation({ summary: 'Get print layout for one contract type' })
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiParam({ name: 'contractType', enum: ContractType })
  @ApiResponse({ status: 200, type: PrintLayoutResponseDto })
  @ApiResponse({ status: 404, description: 'Layout not found' })
  findOne(
    @CurrentUser() actor: PublicUser,
    @Param('organizationId') organizationId: string,
    @Param('contractType', new ParseEnumPipe(ContractType))
    contractType: ContractType,
  ) {
    return this.printLayoutsService.findOne(
      actor,
      organizationId,
      contractType,
    );
  }

  @Put(':contractType')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({
    summary: 'Create or replace print layout for a contract type',
    description:
      'Coordinates are millimeters from the bottom-left corner of A3 portrait (297×420) by default.',
  })
  @ApiParam({ name: 'organizationId', format: 'uuid' })
  @ApiParam({ name: 'contractType', enum: ContractType })
  @ApiResponse({ status: 200, type: PrintLayoutResponseDto })
  upsert(
    @CurrentUser() actor: PublicUser,
    @Param('organizationId') organizationId: string,
    @Param('contractType', new ParseEnumPipe(ContractType))
    contractType: ContractType,
    @Body() dto: UpsertPrintLayoutDto,
  ) {
    return this.printLayoutsService.upsert(
      actor,
      organizationId,
      contractType,
      dto,
    );
  }
}
