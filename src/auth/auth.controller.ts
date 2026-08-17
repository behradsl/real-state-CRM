import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Response } from 'express';
import { getLoginThrottleLimit } from '../common/config/security.config';
import { AuthenticatedRequest } from '../common/types/authenticated-request';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { PublicUser } from '../users/users.service';
import { SESSION_COOKIE_NAME } from './auth.constants';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { LogoutResponseDto } from './dto/logout-response.dto';
import { SessionAuthGuard } from './guards/session-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({
    default: {
      limit: getLoginThrottleLimit(),
      ttl: 60_000,
    },
  })
  @ApiOperation({
    summary: 'Log in',
    description:
      'Validates credentials and sets an httpOnly session cookie (`session_token`). Provide `organizationSlug` for org users; omit it to log in as a platform ADMIN (email only, organizationId null).',
  })
  @ApiResponse({
    status: 201,
    description: 'Logged in; session cookie set',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many login attempts' })
  login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<PublicUser> {
    return this.authService.login(loginDto, res);
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  @ApiCookieAuth(SESSION_COOKIE_NAME)
  @ApiOperation({
    summary: 'Log out',
    description: 'Deletes the server session and clears the session cookie.',
  })
  @ApiResponse({
    status: 201,
    description: 'Logged out',
    type: LogoutResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(req.sessionToken, res);
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  @ApiCookieAuth(SESSION_COOKIE_NAME)
  @ApiOperation({ summary: 'Current user' })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  me(@CurrentUser() user: PublicUser): PublicUser {
    return user;
  }
}
