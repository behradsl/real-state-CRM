import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedRequest } from '../../common/types/authenticated-request';
import { AuthService } from '../auth.service';
import { SESSION_COOKIE_NAME } from '../auth.constants';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.[SESSION_COOKIE_NAME] as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    const user = await this.authService.getSessionUser(token);
    const authRequest = request as AuthenticatedRequest;
    authRequest.user = user;
    authRequest.sessionToken = token;

    return true;
  }
}
