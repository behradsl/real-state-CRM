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
import { createContractBodyExamples } from '../common/swagger/json-examples';
import { PublicUser } from '../users/users.service';
import { ContractsService } from './contracts.service';
import { CreateContractSignatureDto } from './dto/create-contract-signature.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import {
  ContractResponseDto,
  ContractSignatureResponseDto,
} from './dto/contract-response.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@ApiTags('Contracts')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('contracts')
@UseGuards(SessionAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create contract',
    description:
      'Contract-first create: resolve property/parties via id or nested upsert, then upsert typed *Details and ContractLawyer rows. termsAndConditions still accepted and mapped when typed details are omitted.',
  })
  @ApiBody({
    type: CreateContractDto,
    examples: createContractBodyExamples,
  })
  @ApiResponse({
    status: 201,
    description: 'Contract created',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Not allowed to assign organization' })
  @ApiResponse({ status: 409, description: 'Contract number conflict' })
  create(
    @CurrentUser() actor: PublicUser,
    @Body() createContractDto: CreateContractDto,
  ) {
    return this.contractsService.create(actor, createContractDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List contracts',
    description: 'Admin: all. Others: same organization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Visible contracts',
    type: [ContractResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  findAll(@CurrentUser() actor: PublicUser) {
    return this.contractsService.findAll(actor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contract by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Contract found',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to this contract' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  findOne(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.contractsService.findOne(actor, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update contract',
    description:
      'Same upsert semantics as create: may change property/parties, replace typed details for the contract type, and replace lawyers.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Contract updated',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to update this contract' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  update(
    @CurrentUser() actor: PublicUser,
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(actor, id, updateContractDto);
  }

  @Post(':id/signatures')
  @ApiOperation({ summary: 'Add contract signature' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Signature created',
    type: ContractSignatureResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to this contract' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  @ApiResponse({ status: 409, description: 'Signature already exists' })
  addSignature(
    @CurrentUser() actor: PublicUser,
    @Param('id') id: string,
    @Body() createSignatureDto: CreateContractSignatureDto,
  ) {
    return this.contractsService.addSignature(actor, id, createSignatureDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft-delete contract',
    description: 'Sets deletedAt on the contract.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Contract soft-deleted',
    type: ContractResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to delete this contract' })
  @ApiResponse({ status: 404, description: 'Contract not found' })
  remove(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.contractsService.remove(actor, id);
  }
}
