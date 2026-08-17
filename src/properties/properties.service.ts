import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  assertCanAccessProperty,
  isAdmin,
  isOwner,
  propertyListWhere,
  resolveScopedOrganizationId,
  resolveScopedOwnerId,
} from '../common/utils/access-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

const propertySelect = {
  id: true,
  organizationId: true,
  ownerId: true,
  title: true,
  description: true,
  propertyType: true,
  addressId: true,
  address: true,
  areaSqm: true,
  floor: true,
  totalFloors: true,
  yearBuilt: true,
  bedrooms: true,
  bathrooms: true,
  parkingSpots: true,
  furnished: true,
  facilities: true,
  referenceCode: true,
  deedInfo: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PropertySelect;

export type PublicProperty = Prisma.PropertyGetPayload<{
  select: typeof propertySelect;
}>;

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    actor: PublicUser,
    dto: CreatePropertyDto,
  ): Promise<PublicProperty> {
    const organizationId = resolveScopedOrganizationId(
      actor,
      dto.organizationId,
    );
    const ownerId = resolveScopedOwnerId(actor, dto.ownerId);

    await this.assertAssigneeInOrganization(ownerId, organizationId);

    try {
      return await this.prisma.$transaction(async (tx) => {
        let addressId = dto.addressId;

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

        return tx.property.create({
          data: {
            organizationId,
            ownerId,
            title: dto.title,
            description: dto.description,
            propertyType: dto.propertyType,
            addressId,
            areaSqm: dto.areaSqm,
            floor: dto.floor,
            totalFloors: dto.totalFloors,
            yearBuilt: dto.yearBuilt,
            bedrooms: dto.bedrooms,
            bathrooms: dto.bathrooms,
            parkingSpots: dto.parkingSpots,
            furnished: dto.furnished,
            facilities: dto.facilities as Prisma.InputJsonValue | undefined,
            referenceCode: dto.referenceCode,
            deedInfo: dto.deedInfo
              ? {
                  create: {
                    data: dto.deedInfo.data as Prisma.InputJsonValue,
                  },
                }
              : undefined,
          },
          select: propertySelect,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll(actor: PublicUser): Promise<PublicProperty[]> {
    return this.prisma.property.findMany({
      where: propertyListWhere(actor),
      select: propertySelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(actor: PublicUser, id: string): Promise<PublicProperty> {
    const property = await this.prisma.property.findFirst({
      where: { id, deletedAt: null },
      select: propertySelect,
    });

    if (!property) {
      throw new NotFoundException(`Property ${id} not found`);
    }

    assertCanAccessProperty(actor, property);
    return property;
  }

  async update(
    actor: PublicUser,
    id: string,
    dto: UpdatePropertyDto,
  ): Promise<PublicProperty> {
    const existing = await this.prisma.property.findFirst({
      where: { id, deletedAt: null },
      select: propertySelect,
    });

    if (!existing) {
      throw new NotFoundException(`Property ${id} not found`);
    }

    assertCanAccessProperty(actor, existing);

    let ownerId = existing.ownerId;
    if (dto.ownerId !== undefined) {
      if (!isAdmin(actor) && !isOwner(actor)) {
        throw new ForbiddenException('You cannot reassign this property');
      }
      ownerId = resolveScopedOwnerId(actor, dto.ownerId);
      await this.assertAssigneeInOrganization(ownerId, existing.organizationId);
    }

    try {
      return await this.prisma.$transaction(async (tx) => {
        let addressId = dto.addressId;

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

        if (dto.deedInfo) {
          await tx.deedInfo.upsert({
            where: { propertyId: id },
            create: {
              propertyId: id,
              data: dto.deedInfo.data as Prisma.InputJsonValue,
            },
            update: {
              data: dto.deedInfo.data as Prisma.InputJsonValue,
            },
          });
        }

        const data: Prisma.PropertyUncheckedUpdateInput = {
          title: dto.title,
          description: dto.description,
          propertyType: dto.propertyType,
          areaSqm: dto.areaSqm,
          floor: dto.floor,
          totalFloors: dto.totalFloors,
          yearBuilt: dto.yearBuilt,
          bedrooms: dto.bedrooms,
          bathrooms: dto.bathrooms,
          parkingSpots: dto.parkingSpots,
          furnished: dto.furnished,
          facilities:
            dto.facilities === undefined
              ? undefined
              : (dto.facilities as Prisma.InputJsonValue),
          referenceCode: dto.referenceCode,
        };

        if (addressId !== undefined) {
          data.addressId = addressId;
        }

        if (dto.ownerId !== undefined) {
          data.ownerId = ownerId;
        }

        return tx.property.update({
          where: { id },
          data,
          select: propertySelect,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(actor: PublicUser, id: string): Promise<PublicProperty> {
    const existing = await this.prisma.property.findFirst({
      where: { id, deletedAt: null },
      select: propertySelect,
    });

    if (!existing) {
      throw new NotFoundException(`Property ${id} not found`);
    }

    assertCanAccessProperty(actor, existing);

    return this.prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: propertySelect,
    });
  }

  private async assertAssigneeInOrganization(
    ownerId: string,
    organizationId: string,
  ): Promise<void> {
    const assignee = await this.prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true, organizationId: true, isActive: true },
    });

    if (!assignee || !assignee.isActive) {
      throw new NotFoundException('Assigned user not found');
    }

    if (assignee.organizationId !== organizationId) {
      throw new ForbiddenException(
        'Assigned user must belong to the property organization',
      );
    }
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'referenceCode already exists in this organization',
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new NotFoundException('Related organization, user, or address not found');
    }

    throw error;
  }
}
