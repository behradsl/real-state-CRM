import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractPartyRole, Prisma } from '@prisma/client';
import {
  assertCanAccessContract,
  contractListWhere,
  resolveScopedOrganizationId,
} from '../common/utils/access-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';
import { CreateContractSignatureDto } from './dto/create-contract-signature.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

const contractSelect = {
  id: true,
  organizationId: true,
  createdById: true,
  propertyId: true,
  contractType: true,
  contractNumber: true,
  description: true,
  commissionPercentage: true,
  commissionAmount: true,
  taxPercentage: true,
  taxAmount: true,
  firstPartyCommissionPercentage: true,
  firstPartyCommissionAmount: true,
  secondPartyCommissionPercentage: true,
  secondPartyCommissionAmount: true,
  totalAmount: true,
  monthlyAmount: true,
  depositAmount: true,
  startDate: true,
  endDate: true,
  deliveryDate: true,
  officialDeedDate: true,
  termsAndConditions: true,
  signedAt: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
  property: {
    include: {
      address: true,
      deedInfo: true,
    },
  },
  parties: {
    include: {
      party: {
        include: { address: true },
      },
    },
  },
  signatures: true,
} satisfies Prisma.ContractSelect;

type ContractRecord = Prisma.ContractGetPayload<{
  select: typeof contractSelect;
}>;

type DecimalField =
  | 'commissionPercentage'
  | 'commissionAmount'
  | 'taxPercentage'
  | 'taxAmount'
  | 'firstPartyCommissionPercentage'
  | 'firstPartyCommissionAmount'
  | 'secondPartyCommissionPercentage'
  | 'secondPartyCommissionAmount'
  | 'totalAmount'
  | 'monthlyAmount'
  | 'depositAmount';

export type PublicContract = Omit<ContractRecord, DecimalField> &
  Record<DecimalField, string | null>;

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    actor: PublicUser,
    dto: CreateContractDto,
  ): Promise<PublicContract> {
    const organizationId = resolveScopedOrganizationId(
      actor,
      dto.organizationId,
    );

    await this.assertPropertyAndPartiesInOrg(organizationId, dto);

    const partyRows: Prisma.ContractPartyCreateWithoutContractInput[] = [
      {
        role: ContractPartyRole.FIRST_PARTY,
        party: { connect: { id: dto.firstPartyId } },
      },
      {
        role: ContractPartyRole.SECOND_PARTY,
        party: { connect: { id: dto.secondPartyId } },
      },
      ...(dto.witnessIds ?? []).map((partyId) => ({
        role: ContractPartyRole.WITNESS,
        party: { connect: { id: partyId } },
      })),
    ];

    try {
      const created = await this.prisma.contract.create({
        data: {
          organizationId,
          createdById: actor.id,
          propertyId: dto.propertyId,
          contractType: dto.contractType,
          contractNumber: dto.contractNumber,
          description: dto.description,
          commissionPercentage: dto.commissionPercentage,
          commissionAmount: dto.commissionAmount,
          taxPercentage: dto.taxPercentage,
          taxAmount: dto.taxAmount,
          firstPartyCommissionPercentage: dto.firstPartyCommissionPercentage,
          firstPartyCommissionAmount: dto.firstPartyCommissionAmount,
          secondPartyCommissionPercentage: dto.secondPartyCommissionPercentage,
          secondPartyCommissionAmount: dto.secondPartyCommissionAmount,
          totalAmount: dto.totalAmount,
          monthlyAmount: dto.monthlyAmount,
          depositAmount: dto.depositAmount,
          startDate: dto.startDate ? new Date(dto.startDate) : undefined,
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          deliveryDate: dto.deliveryDate
            ? new Date(dto.deliveryDate)
            : undefined,
          officialDeedDate: dto.officialDeedDate
            ? new Date(dto.officialDeedDate)
            : undefined,
          termsAndConditions: dto.termsAndConditions as
            | Prisma.InputJsonValue
            | undefined,
          parties: { create: partyRows },
        },
        select: contractSelect,
      });

      return this.toPublic(created);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAll(actor: PublicUser): Promise<PublicContract[]> {
    const rows = await this.prisma.contract.findMany({
      where: contractListWhere(actor),
      select: contractSelect,
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => this.toPublic(row));
  }

  async findOne(actor: PublicUser, id: string): Promise<PublicContract> {
    const contract = await this.prisma.contract.findFirst({
      where: { id, deletedAt: null },
      select: contractSelect,
    });

    if (!contract) {
      throw new NotFoundException(`Contract ${id} not found`);
    }

    assertCanAccessContract(actor, contract);
    return this.toPublic(contract);
  }

  async update(
    actor: PublicUser,
    id: string,
    dto: UpdateContractDto,
  ): Promise<PublicContract> {
    await this.findOne(actor, id);

    try {
      const updated = await this.prisma.contract.update({
        where: { id },
        data: {
          contractType: dto.contractType,
          contractNumber: dto.contractNumber,
          description: dto.description,
          commissionPercentage: dto.commissionPercentage,
          commissionAmount: dto.commissionAmount,
          taxPercentage: dto.taxPercentage,
          taxAmount: dto.taxAmount,
          firstPartyCommissionPercentage: dto.firstPartyCommissionPercentage,
          firstPartyCommissionAmount: dto.firstPartyCommissionAmount,
          secondPartyCommissionPercentage: dto.secondPartyCommissionPercentage,
          secondPartyCommissionAmount: dto.secondPartyCommissionAmount,
          totalAmount: dto.totalAmount,
          monthlyAmount: dto.monthlyAmount,
          depositAmount: dto.depositAmount,
          startDate:
            dto.startDate === undefined
              ? undefined
              : dto.startDate
                ? new Date(dto.startDate)
                : null,
          endDate:
            dto.endDate === undefined
              ? undefined
              : dto.endDate
                ? new Date(dto.endDate)
                : null,
          deliveryDate:
            dto.deliveryDate === undefined
              ? undefined
              : dto.deliveryDate
                ? new Date(dto.deliveryDate)
                : null,
          officialDeedDate:
            dto.officialDeedDate === undefined
              ? undefined
              : dto.officialDeedDate
                ? new Date(dto.officialDeedDate)
                : null,
          termsAndConditions:
            dto.termsAndConditions === undefined
              ? undefined
              : (dto.termsAndConditions as Prisma.InputJsonValue),
          signedAt:
            dto.signedAt === undefined ? undefined : new Date(dto.signedAt),
        },
        select: contractSelect,
      });

      return this.toPublic(updated);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async addSignature(
    actor: PublicUser,
    contractId: string,
    dto: CreateContractSignatureDto,
  ) {
    const contract = await this.findOne(actor, contractId);

    const linked = contract.parties?.some((p) => p.partyId === dto.partyId);
    if (!linked) {
      throw new BadRequestException(
        'partyId must be linked to this contract',
      );
    }

    if (dto.fileId) {
      const file = await this.prisma.file.findUnique({
        where: { id: dto.fileId },
        select: { id: true },
      });
      if (!file) {
        throw new NotFoundException(`File ${dto.fileId} not found`);
      }
    }

    try {
      return await this.prisma.contractSignature.create({
        data: {
          contractId,
          partyId: dto.partyId,
          fileId: dto.fileId,
          data: dto.data as Prisma.InputJsonValue | undefined,
          signedAt: dto.signedAt ? new Date(dto.signedAt) : undefined,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async remove(actor: PublicUser, id: string): Promise<PublicContract> {
    await this.findOne(actor, id);

    const deleted = await this.prisma.contract.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: contractSelect,
    });

    return this.toPublic(deleted);
  }

  private async assertPropertyAndPartiesInOrg(
    organizationId: string,
    dto: CreateContractDto,
  ): Promise<void> {
    const property = await this.prisma.property.findFirst({
      where: { id: dto.propertyId, deletedAt: null },
      select: { id: true, organizationId: true },
    });

    if (!property) {
      throw new NotFoundException(`Property ${dto.propertyId} not found`);
    }

    if (property.organizationId !== organizationId) {
      throw new BadRequestException(
        'Property must belong to the contract organization',
      );
    }

    const partyIds = [
      dto.firstPartyId,
      dto.secondPartyId,
      ...(dto.witnessIds ?? []),
    ];
    const uniquePartyIds = [...new Set(partyIds)];

    if (uniquePartyIds.length !== partyIds.length) {
      throw new BadRequestException('Duplicate party ids are not allowed');
    }

    const parties = await this.prisma.party.findMany({
      where: {
        id: { in: uniquePartyIds },
        deletedAt: null,
      },
      select: { id: true, organizationId: true },
    });

    if (parties.length !== uniquePartyIds.length) {
      throw new NotFoundException('One or more parties were not found');
    }

    const mismatched = parties.find((p) => p.organizationId !== organizationId);
    if (mismatched) {
      throw new BadRequestException(
        'All parties must belong to the contract organization',
      );
    }
  }

  private toPublic(row: ContractRecord): PublicContract {
    return {
      ...row,
      commissionPercentage: this.decimalToString(row.commissionPercentage),
      commissionAmount: this.decimalToString(row.commissionAmount),
      taxPercentage: this.decimalToString(row.taxPercentage),
      taxAmount: this.decimalToString(row.taxAmount),
      firstPartyCommissionPercentage: this.decimalToString(
        row.firstPartyCommissionPercentage,
      ),
      firstPartyCommissionAmount: this.decimalToString(
        row.firstPartyCommissionAmount,
      ),
      secondPartyCommissionPercentage: this.decimalToString(
        row.secondPartyCommissionPercentage,
      ),
      secondPartyCommissionAmount: this.decimalToString(
        row.secondPartyCommissionAmount,
      ),
      totalAmount: this.decimalToString(row.totalAmount),
      monthlyAmount: this.decimalToString(row.monthlyAmount),
      depositAmount: this.decimalToString(row.depositAmount),
    };
  }

  private decimalToString(value: Prisma.Decimal | null): string | null {
    return value === null ? null : value.toString();
  }

  private handlePrismaError(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(
        'Contract number or signature already exists',
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2003'
    ) {
      throw new NotFoundException('Related record not found');
    }

    throw error;
  }
}
