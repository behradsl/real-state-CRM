import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SESSION_COOKIE_NAME } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { AddressResponseDto } from '../common/dto/address-response.dto';
import { CreateAddressDto } from '../common/dto/create-address.dto';
import { UpdateAddressDto } from '../common/dto/update-address.dto';
import { PublicUser } from '../users/users.service';
import { AddressesService } from './addresses.service';

@ApiTags('Addresses')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('addresses')
@UseGuards(SessionAuthGuard, RolesGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create address',
    description: 'Any authenticated user can create an address row.',
  })
  @ApiResponse({
    status: 201,
    description: 'Address created',
    type: AddressResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  create(
    @CurrentUser() actor: PublicUser,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.create(actor, createAddressDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get address by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Address found',
    type: AddressResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  findOne(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.addressesService.findOne(actor, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Address updated',
    type: AddressResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  update(
    @CurrentUser() actor: PublicUser,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(actor, id, updateAddressDto);
  }
}
