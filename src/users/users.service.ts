import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import {
  assertCanAccessUser,
  assertCanAssignRole,
  isAdmin,
  isOwner,
  resolveCreateUserOrganizationId,
  userListWhere,
} from '../common/utils/access-scope.util';
import {
  comparePassword,
  hashPassword,
} from '../common/utils/password.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userPublicSelect = {
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
  organization: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof userPublicSelect;
}>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(actor: PublicUser, dto: CreateUserDto): Promise<PublicUser> {
    const organizationId = resolveCreateUserOrganizationId(
      actor,
      dto.organizationId,
      dto.role,
    );
    assertCanAssignRole(actor, dto.role);

    const passwordHash = await hashPassword(dto.password);

    try {
      return await this.prisma.user.create({
        data: {
          organizationId,
          email: dto.email,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          role: dto.role,
        },
        select: userPublicSelect,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll(actor: PublicUser): Promise<PublicUser[]> {
    return this.prisma.user.findMany({
      where: userListWhere(actor),
      select: userPublicSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(actor: PublicUser, id: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    assertCanAccessUser(actor, user);
    return user;
  }

  async update(
    actor: PublicUser,
    id: string,
    dto: UpdateUserDto,
  ): Promise<PublicUser> {
    const existing = await this.findOne(actor, id);

    this.assertCanMutateUser(actor, existing, dto);
    assertCanAssignRole(actor, dto.role);

    const data: Prisma.UserUpdateInput = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      role: dto.role,
      isActive: dto.isActive,
    };

    // Non-admin / non-owner editing themselves cannot change role or active flag
    if (!isAdmin(actor) && !isOwner(actor)) {
      delete data.role;
      delete data.isActive;
    }

    if (dto.password) {
      data.passwordHash = await hashPassword(dto.password);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: userPublicSelect,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(actor: PublicUser, id: string): Promise<PublicUser> {
    const existing = await this.findOne(actor, id);

    if (!isAdmin(actor) && !isOwner(actor)) {
      throw new ForbiddenException('You cannot delete users');
    }

    // Owners cannot delete admins
    if (isOwner(actor) && existing.role === UserRole.ADMIN) {
      throw new ForbiddenException('You cannot delete an admin user');
    }

    try {
      return await this.prisma.user.delete({
        where: { id },
        select: userPublicSelect,
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async validateCredentials(
    organizationId: string,
    email: string,
    password: string,
  ): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: {
        organizationId_email: { organizationId, email },
      },
      select: { ...userPublicSelect, passwordHash: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await comparePassword(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }

  async validateAdminCredentials(
    email: string,
    password: string,
  ): Promise<PublicUser> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        role: UserRole.ADMIN,
        organizationId: null,
        isActive: true,
      },
      select: { ...userPublicSelect, passwordHash: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const matches = await comparePassword(password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { passwordHash: _, ...publicUser } = user;
    return publicUser;
  }

  private assertCanMutateUser(
    actor: PublicUser,
    target: PublicUser,
    dto: UpdateUserDto,
  ): void {
    if (isAdmin(actor)) {
      return;
    }

    if (isOwner(actor)) {
      if (target.role === UserRole.ADMIN) {
        throw new ForbiddenException('You cannot modify an admin user');
      }
      return;
    }

    // Regular users: only self, and not privilege fields (stripped above)
    if (actor.id !== target.id) {
      throw new ForbiddenException('You do not have access to this user');
    }

    if (dto.role !== undefined || dto.isActive !== undefined) {
      throw new ForbiddenException(
        'You cannot change role or active status',
      );
    }
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('Email already exists in this organization');
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new NotFoundException('Organization not found');
    }

    throw error;
  }
}
