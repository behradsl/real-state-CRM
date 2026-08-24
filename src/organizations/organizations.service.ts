import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import {
  assertCanAccessOrganization,
  organizationListWhere,
} from '../common/utils/access-scope.util';
import { hashPassword } from '../common/utils/password.util';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

const organizationSelect = {
  id: true,
  name: true,
  slug: true,
  phone: true,
  email: true,
  website: true,
  addressId: true,
  address: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.OrganizationSelect;

const ownerSelect = {
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

export type PublicOrganization = Prisma.OrganizationGetPayload<{
  select: typeof organizationSelect;
}>;

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    _actor: PublicUser,
    dto: CreateOrganizationDto,
  ): Promise<PublicOrganization & { owner: PublicUser }> {
    const passwordHash = await hashPassword(dto.owner.password);

    try {
      return await this.prisma.$transaction(async (tx) => {
        let addressId: string | undefined;

        if (dto.address) {
          const address = await tx.address.create({
            data: {
              province: dto.address.province,
              city: dto.address.city,
              details: dto.address.details,
              plaque: dto.address.plaque,
              postalCode: dto.address.postalCode,
              latitude: dto.address.latitude,
              longitude: dto.address.longitude,
            },
          });
          addressId = address.id;
        }

        const organization = await tx.organization.create({
          data: {
            name: dto.name,
            slug: dto.slug,
            phone: dto.phone,
            email: dto.email,
            website: dto.website,
            addressId,
          },
          select: organizationSelect,
        });

        const owner = await tx.user.create({
          data: {
            organizationId: organization.id,
            email: dto.owner.email,
            passwordHash,
            firstName: dto.owner.firstName,
            lastName: dto.owner.lastName,
            phone: dto.owner.phone,
            role: UserRole.OWNER,
          },
          select: ownerSelect,
        });

        return { ...organization, owner };
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll(actor: PublicUser): Promise<PublicOrganization[]> {
    return this.prisma.organization.findMany({
      where: organizationListWhere(actor),
      select: organizationSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(actor: PublicUser, id: string): Promise<PublicOrganization> {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      select: organizationSelect,
    });

    if (!organization) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    assertCanAccessOrganization(actor, organization.id);
    return organization;
  }

  async update(
    actor: PublicUser,
    id: string,
    dto: UpdateOrganizationDto,
  ): Promise<PublicOrganization> {
    const existing = await this.prisma.organization.findUnique({
      where: { id },
      select: organizationSelect,
    });

    if (!existing) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    assertCanAccessOrganization(actor, existing.id);

    try {
      return await this.prisma.$transaction(async (tx) => {
        let addressId = existing.addressId;

        if (dto.address) {
          const address = await tx.address.create({
            data: {
              province: dto.address.province,
              city: dto.address.city,
              details: dto.address.details,
              plaque: dto.address.plaque,
              postalCode: dto.address.postalCode,
              latitude: dto.address.latitude,
              longitude: dto.address.longitude,
            },
          });
          addressId = address.id;
        }

        return tx.organization.update({
          where: { id },
          data: {
            name: dto.name,
            slug: dto.slug,
            phone: dto.phone,
            email: dto.email,
            website: dto.website,
            ...(dto.address ? { addressId } : {}),
          },
          select: organizationSelect,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Organization slug or owner email already exists',
      );
    }

    throw error;
  }
}
