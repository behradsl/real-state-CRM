import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  assertCanAccessParty,
  partyListWhere,
  resolveScopedOrganizationId,
} from '../common/utils/access-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

const partySelect = {
  id: true,
  organizationId: true,
  type: true,
  firstName: true,
  lastName: true,
  nationalCode: true,
  economicCode: true,
  companyName: true,
  birthDate: true,
  birthPlace: true,
  identityExportPlace: true,
  fatherName: true,
  identityNumber: true,
  gender: true,
  phone: true,
  email: true,
  addressId: true,
  address: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PartySelect;

export type PublicParty = Prisma.PartyGetPayload<{
  select: typeof partySelect;
}>;

@Injectable()
export class PartiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(actor: PublicUser, dto: CreatePartyDto): Promise<PublicParty> {
    const organizationId = resolveScopedOrganizationId(
      actor,
      dto.organizationId,
    );

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

        return tx.party.create({
          data: {
            organizationId,
            type: dto.type,
            firstName: dto.firstName,
            lastName: dto.lastName,
            nationalCode: dto.nationalCode,
            economicCode: dto.economicCode,
            companyName: dto.companyName,
            birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
            birthPlace: dto.birthPlace,
            identityExportPlace: dto.identityExportPlace,
            fatherName: dto.fatherName,
            identityNumber: dto.identityNumber,
            gender: dto.gender,
            phone: dto.phone,
            email: dto.email,
            addressId,
          },
          select: partySelect,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  findAll(actor: PublicUser): Promise<PublicParty[]> {
    return this.prisma.party.findMany({
      where: partyListWhere(actor),
      select: partySelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(actor: PublicUser, id: string): Promise<PublicParty> {
    const party = await this.prisma.party.findFirst({
      where: { id, deletedAt: null },
      select: partySelect,
    });

    if (!party) {
      throw new NotFoundException(`Party ${id} not found`);
    }

    assertCanAccessParty(actor, party);
    return party;
  }

  async update(
    actor: PublicUser,
    id: string,
    dto: UpdatePartyDto,
  ): Promise<PublicParty> {
    const existing = await this.findOne(actor, id);

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

        return tx.party.update({
          where: { id: existing.id },
          data: {
            type: dto.type,
            firstName: dto.firstName,
            lastName: dto.lastName,
            nationalCode: dto.nationalCode,
            economicCode: dto.economicCode,
            companyName: dto.companyName,
            birthDate:
              dto.birthDate === undefined
                ? undefined
                : new Date(dto.birthDate),
            birthPlace: dto.birthPlace,
            identityExportPlace: dto.identityExportPlace,
            fatherName: dto.fatherName,
            identityNumber: dto.identityNumber,
            gender: dto.gender,
            phone: dto.phone,
            email: dto.email,
            addressId,
          },
          select: partySelect,
        });
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(actor: PublicUser, id: string): Promise<PublicParty> {
    await this.findOne(actor, id);

    return this.prisma.party.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: partySelect,
    });
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new NotFoundException('Related organization or address not found');
    }

    throw error;
  }
}
