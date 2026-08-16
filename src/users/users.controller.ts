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
import { UserRole } from '@prisma/client';
import { SESSION_COOKIE_NAME } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PublicUser, UsersService } from './users.service';

@ApiTags('Users')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('users')
@UseGuards(SessionAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({
    summary: 'Create user',
    description:
      'Admin: any organization. Owner: only their organization (cannot create ADMIN).',
  })
  @ApiResponse({
    status: 201,
    description: 'User created',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Not admin or organization owner' })
  @ApiResponse({
    status: 409,
    description: 'Email already exists in organization',
  })
  create(
    @CurrentUser() actor: PublicUser,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(actor, createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List users',
    description:
      'Admin: all users. Owner: organization users. Others: only themselves.',
  })
  @ApiResponse({
    status: 200,
    description: 'Users visible to the current role',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  findAll(@CurrentUser() actor: PublicUser) {
    return this.usersService.findAll(actor);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description:
      'Admin: any. Owner: same organization. Others: only own profile.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to this user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.usersService.findOne(actor, id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description:
      'Admin: any. Owner: org users (not admins). Others: own profile only (no role/active changes).',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'No access to update this user' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 409,
    description: 'Email already exists in organization',
  })
  update(
    @CurrentUser() actor: PublicUser,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(actor, id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  @ApiOperation({
    summary: 'Delete user',
    description: 'Admin or organization owner only. Owners cannot delete admins.',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.usersService.remove(actor, id);
  }
}
