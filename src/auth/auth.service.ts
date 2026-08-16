import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser, UsersService } from '../users/users.service';
import { SESSION_MAX_AGE_MS } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import {
  SESSION_COOKIE_NAME,
  getClearSessionCookieOptions,
  getSessionCookieOptions,
} from './session-cookie';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async login(dto: LoginDto, res: Response): Promise<PublicUser> {
    const organization = await this.prisma.organization.findUnique({
      where: { slug: dto.organizationSlug },
    });

    if (!organization) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.usersService.validateCredentials(
      organization.id,
      dto.email,
      dto.password,
    );

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);

    await this.prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    this.setSessionCookie(res, token);
    return user;
  }

  async logout(sessionToken: string, res: Response): Promise<{ ok: true }> {
    await this.prisma.session.deleteMany({
      where: { token: sessionToken },
    });

    res.clearCookie(SESSION_COOKIE_NAME, getClearSessionCookieOptions());

    return { ok: true };
  }

  async getSessionUser(sessionToken: string): Promise<PublicUser> {
    const session = await this.prisma.session.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            organizationId: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await this.prisma.session.delete({ where: { id: session.id } });
      }
      throw new UnauthorizedException('Session expired or invalid');
    }

    if (!session.user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    return session.user;
  }

  private setSessionCookie(res: Response, token: string) {
    res.cookie(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
  }
}
