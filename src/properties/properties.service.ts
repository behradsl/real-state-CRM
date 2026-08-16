import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PropertyStatus } from '@prisma/client';
import {
  assertCanAccessProperty,
  isAdmin,
  isOwner,
  propertyListWhere,
  resolvePropertyOrganizationId,
  resolvePropertyOwnerId,
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
  listingType: true,
  status: true,
  address: true,
  city: true,
  district: true,
  country: true,
  postalCode: true,
  latitude: true,
  longitude: true,
  price: true,
  currency: true,
  bedrooms: true,
  bathrooms: true,
  parkingSpots: true,
  areaSqm: true,
  floor: true,
  totalFloors: true,
  yearBuilt: true,
  furnished: true,
  referenceCode: true,
  publishedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PropertySelect;

type PropertyRecord = Prisma.PropertyGetPayload<{
  select: typeof propertySelect;
}>;

export type PublicProperty = Omit<PropertyRecord, 'price'> & { price: string };

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    actor: PublicUser,
    dto: CreatePropertyDto,
  ): Promise<PublicProperty> {
    const organizationId = resolvePropertyOrganizationId(
      actor,
      dto.organizationId,
    );
    const ownerId = resolvePropertyOwnerId(actor, dto.ownerId);

    await this.assertAssigneeInOrganization(ownerId, organizationId);

    try {
      const created = await this.prisma.property.create({
        data: {
          organizationId,
          ownerId,
          title: dto.title,
          description: dto.description,
          propertyType: dto.propertyType,
          listingType: dto.listingType,
          status: dto.status,
          address: dto.address,
          city: dto.city,
          district: dto.district,
          country: dto.country,
          postalCode: dto.postalCode,
          latitude: dto.latitude,
          longitude: dto.longitude,
          price: dto.price,
          currency: dto.currency,
          bedrooms: dto.bedrooms,
          bathrooms: dto.bathrooms,
          parkingSpots: dto.parkingSpots,
          areaSqm: dto.areaSqm,
          floor: dto.floor,
          totalFloors: dto.totalFloors,
          yearBuilt: dto.yearBuilt,
          furnished: dto.furnished,
          referenceCode: dto.referenceCode,
          publishedAt:
            dto.status && dto.status !== PropertyStatus.DRAFT
              ? new Date()
              : undefined,
        },
        select: propertySelect,
      });

      return this.toPublic(created);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(actor: PublicUser): Promise<PublicProperty[]> {
    const rows = await this.prisma.property.findMany({
      where: propertyListWhere(actor),
      select: propertySelect,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => this.toPublic(row));
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
    return this.toPublic(property);
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
      ownerId = resolvePropertyOwnerId(actor, dto.ownerId);
      await this.assertAssigneeInOrganization(ownerId, existing.organizationId);
    }

    const data: Prisma.PropertyUpdateInput = {
      title: dto.title,
      description: dto.description,
      propertyType: dto.propertyType,
      listingType: dto.listingType,
      status: dto.status,
      address: dto.address,
      city: dto.city,
      district: dto.district,
      country: dto.country,
      postalCode: dto.postalCode,
      latitude: dto.latitude,
      longitude: dto.longitude,
      price: dto.price,
      currency: dto.currency,
      bedrooms: dto.bedrooms,
      bathrooms: dto.bathrooms,
      parkingSpots: dto.parkingSpots,
      areaSqm: dto.areaSqm,
      floor: dto.floor,
      totalFloors: dto.totalFloors,
      yearBuilt: dto.yearBuilt,
      furnished: dto.furnished,
      referenceCode: dto.referenceCode,
      owner: dto.ownerId !== undefined ? { connect: { id: ownerId } } : undefined,
    };

    if (
      dto.status &&
      dto.status !== PropertyStatus.DRAFT &&
      !existing.publishedAt
    ) {
      data.publishedAt = new Date();
    }

    try {
      const updated = await this.prisma.property.update({
        where: { id },
        data,
        select: propertySelect,
      });
      return this.toPublic(updated);
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

    const deleted = await this.prisma.property.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: PropertyStatus.OFF_MARKET,
      },
      select: propertySelect,
    });

    return this.toPublic(deleted);
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

  private toPublic(row: PropertyRecord): PublicProperty {
    return {
      ...row,
      price: row.price.toString(),
    };
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
      throw new NotFoundException('Related organization or user not found');
    }

    throw error;
  }
}
