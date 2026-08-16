import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  assertCanAccessClient,
  clientListWhere,
  isAdmin,
  isOwner,
  resolveScopedOrganizationId,
  resolveScopedOwnerId,
} from '../common/utils/access-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

const clientSelect = {
  id: true,
  organizationId: true,
  ownerId: true,
  type: true,
  firstName: true,
  lastName: true,
  gender: true,
  email: true,
  phone: true,
  secondaryPhone: true,
  company: true,
  address: true,
  city: true,
  notes: true,
  source: true,
  budgetMin: true,
  budgetMax: true,
  preferredCities: true,
  preferredTypes: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ClientSelect;

type ClientRecord = Prisma.ClientGetPayload<{ select: typeof clientSelect }>;

export type PublicClient = Omit<ClientRecord, 'budgetMin' | 'budgetMax'> & {
  budgetMin: string | null;
  budgetMax: string | null;
};

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(actor: PublicUser, dto: CreateClientDto): Promise<PublicClient> {
    const organizationId = resolveScopedOrganizationId(
      actor,
      dto.organizationId,
    );
    const ownerId = resolveScopedOwnerId(actor, dto.ownerId);

    await this.assertAssigneeInOrganization(ownerId, organizationId);

    const created = await this.prisma.client.create({
      data: {
        organizationId,
        ownerId,
        type: dto.type,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        email: dto.email,
        phone: dto.phone,
        secondaryPhone: dto.secondaryPhone,
        company: dto.company,
        address: dto.address,
        city: dto.city,
        notes: dto.notes,
        source: dto.source,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        preferredCities: dto.preferredCities ?? [],
        preferredTypes: dto.preferredTypes ?? [],
      },
      select: clientSelect,
    });

    return this.toPublic(created);
  }

  async findAll(actor: PublicUser): Promise<PublicClient[]> {
    const rows = await this.prisma.client.findMany({
      where: clientListWhere(actor),
      select: clientSelect,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => this.toPublic(row));
  }

  async findOne(actor: PublicUser, id: string): Promise<PublicClient> {
    const client = await this.prisma.client.findFirst({
      where: { id, deletedAt: null },
      select: clientSelect,
    });

    if (!client) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    assertCanAccessClient(actor, client);
    return this.toPublic(client);
  }

  async update(
    actor: PublicUser,
    id: string,
    dto: UpdateClientDto,
  ): Promise<PublicClient> {
    const existing = await this.prisma.client.findFirst({
      where: { id, deletedAt: null },
      select: clientSelect,
    });

    if (!existing) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    assertCanAccessClient(actor, existing);

    let ownerId = existing.ownerId;
    if (dto.ownerId !== undefined) {
      if (!isAdmin(actor) && !isOwner(actor)) {
        throw new ForbiddenException('You cannot reassign this client');
      }
      ownerId = resolveScopedOwnerId(actor, dto.ownerId);
      await this.assertAssigneeInOrganization(ownerId, existing.organizationId);
    }

    const updated = await this.prisma.client.update({
      where: { id },
      data: {
        type: dto.type,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        email: dto.email,
        phone: dto.phone,
        secondaryPhone: dto.secondaryPhone,
        company: dto.company,
        address: dto.address,
        city: dto.city,
        notes: dto.notes,
        source: dto.source,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        preferredCities: dto.preferredCities,
        preferredTypes: dto.preferredTypes,
        owner:
          dto.ownerId !== undefined ? { connect: { id: ownerId } } : undefined,
      },
      select: clientSelect,
    });

    return this.toPublic(updated);
  }

  async remove(actor: PublicUser, id: string): Promise<PublicClient> {
    const existing = await this.prisma.client.findFirst({
      where: { id, deletedAt: null },
      select: clientSelect,
    });

    if (!existing) {
      throw new NotFoundException(`Client ${id} not found`);
    }

    assertCanAccessClient(actor, existing);

    const deleted = await this.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: clientSelect,
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
        'Assigned user must belong to the client organization',
      );
    }
  }

  private toPublic(row: ClientRecord): PublicClient {
    return {
      ...row,
      budgetMin: row.budgetMin?.toString() ?? null,
      budgetMax: row.budgetMax?.toString() ?? null,
    };
  }
}
