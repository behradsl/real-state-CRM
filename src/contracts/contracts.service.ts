import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ContractLawyerSide,
  ContractPartyRole,
  ContractType,
  PartyType,
  Prisma,
  PropertyType,
} from '@prisma/client';
import {
  assertCanAccessContract,
  contractListWhere,
  isAdmin,
  resolveScopedOrganizationId,
} from '../common/utils/access-scope.util';
import { PartiesService } from '../parties/parties.service';
import { CreatePartyDto } from '../parties/dto/create-party.dto';
import { UpdatePartyDto } from '../parties/dto/update-party.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PropertiesService } from '../properties/properties.service';
import { CreatePropertyDto } from '../properties/dto/create-property.dto';
import { UpdatePropertyDto } from '../properties/dto/update-property.dto';
import { PublicUser } from '../users/users.service';
import {
  ContractPartyInputDto,
  ContractPropertyInputDto,
} from './dto/contract-nested.dto';
import { CreateContractSignatureDto } from './dto/create-contract-signature.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import {
  ConstructionJvDetailsDto,
  ContractLawyersDto,
  GoodwillDetailsDto,
  LawyerDto,
  MutualRescissionDetailsDto,
  PreSaleDetailsDto,
  RentDetailsDto,
  SaleDetailsDto,
} from './dto/typed-details.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

const contractSelect = {
  id: true,
  organizationId: true,
  createdById: true,
  propertyId: true,
  contractType: true,
  contractNumber: true,
  description: true,
  contractDate: true,
  contractTime: true,
  commissionPercentage: true,
  commissionAmount: true,
  taxPercentage: true,
  taxAmount: true,
  firstPartyCommissionPercentage: true,
  firstPartyCommissionAmount: true,
  secondPartyCommissionPercentage: true,
  secondPartyCommissionAmount: true,
  commissionCityRules: true,
  commissionFactorNumber: true,
  firstPartyFactorNumber: true,
  secondPartyFactorNumber: true,
  notes: true,
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
  lawyers: true,
  saleDetails: true,
  rentDetails: true,
  goodwillDetails: true,
  preSaleDetails: true,
  rescissionDetails: true,
  cjvDetails: true,
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

export type PublicContract = Omit<
  ContractRecord,
  | DecimalField
  | 'saleDetails'
  | 'rentDetails'
  | 'goodwillDetails'
  | 'preSaleDetails'
  | 'rescissionDetails'
  | 'cjvDetails'
> &
  Record<DecimalField, string | null> & {
    saleDetails: Record<string, unknown> | null;
    rentDetails: Record<string, unknown> | null;
    goodwillDetails: Record<string, unknown> | null;
    preSaleDetails: Record<string, unknown> | null;
    rescissionDetails: Record<string, unknown> | null;
    cjvDetails: Record<string, unknown> | null;
  };

type ResolvedDetails = {
  saleDetails?: SaleDetailsDto;
  rentDetails?: RentDetailsDto;
  goodwillDetails?: GoodwillDetailsDto;
  preSaleDetails?: PreSaleDetailsDto;
  rescissionDetails?: MutualRescissionDetailsDto;
  cjvDetails?: ConstructionJvDetailsDto;
  lawyers?: ContractLawyersDto;
  headerFromTerms?: Partial<{
    contractDate: string;
    contractTime: string;
    notes: string;
    description: string;
    commissionCityRules: string;
    commissionFactorNumber: string;
    commissionAmount: number;
    firstPartyCommissionAmount: number;
    secondPartyCommissionAmount: number;
    taxPercentage: number;
    taxAmount: number;
  }>;
};

type CrmSync = {
  totalAmount?: number;
  monthlyAmount?: number;
  depositAmount?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  deliveryDate?: Date | null;
  officialDeedDate?: Date | null;
};

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly partiesService: PartiesService,
    private readonly propertiesService: PropertiesService,
  ) {}

  async create(
    actor: PublicUser,
    dto: CreateContractDto,
  ): Promise<PublicContract> {
    const organizationId = resolveScopedOrganizationId(
      actor,
      dto.organizationId,
    );

    const propertyId = await this.resolvePropertyId(actor, organizationId, dto);
    const firstPartyId = (await this.resolvePartyId(
      actor,
      organizationId,
      dto.firstParty,
      dto.firstPartyId,
      'firstParty',
    )) as string;
    const secondPartyId = (await this.resolvePartyId(
      actor,
      organizationId,
      dto.secondParty,
      dto.secondPartyId,
      'secondParty',
    )) as string;
    const witnessIds = await this.resolveWitnessIds(
      actor,
      organizationId,
      dto,
    );

    await this.assertPropertyAndPartiesInOrg(organizationId, {
      propertyId,
      partyIds: [firstPartyId, secondPartyId, ...witnessIds],
    });

    const resolved = this.resolveDetailsAndLawyers(dto.contractType, dto);
    const crm = this.deriveCrmColumns(dto.contractType, resolved, dto);

    const partyRows: Prisma.ContractPartyCreateWithoutContractInput[] = [
      {
        role: ContractPartyRole.FIRST_PARTY,
        party: { connect: { id: firstPartyId } },
      },
      {
        role: ContractPartyRole.SECOND_PARTY,
        party: { connect: { id: secondPartyId } },
      },
      ...witnessIds.map((partyId) => ({
        role: ContractPartyRole.WITNESS,
        party: { connect: { id: partyId } },
      })),
    ];

    try {
      const created = await this.prisma.contract.create({
        data: {
          organizationId,
          createdById: actor.id,
          propertyId,
          contractType: dto.contractType,
          contractNumber: dto.contractNumber,
          description:
            dto.description ?? resolved.headerFromTerms?.description,
          contractDate:
            dto.contractDate ?? resolved.headerFromTerms?.contractDate,
          contractTime:
            dto.contractTime ?? resolved.headerFromTerms?.contractTime,
          notes: dto.notes ?? resolved.headerFromTerms?.notes,
          commissionCityRules:
            dto.commissionCityRules ??
            resolved.headerFromTerms?.commissionCityRules,
          commissionFactorNumber:
            dto.commissionFactorNumber ??
            resolved.headerFromTerms?.commissionFactorNumber,
          firstPartyFactorNumber: dto.firstPartyFactorNumber,
          secondPartyFactorNumber: dto.secondPartyFactorNumber,
          commissionPercentage: dto.commissionPercentage,
          commissionAmount:
            dto.commissionAmount ??
            resolved.headerFromTerms?.commissionAmount,
          taxPercentage:
            dto.taxPercentage ?? resolved.headerFromTerms?.taxPercentage,
          taxAmount: dto.taxAmount ?? resolved.headerFromTerms?.taxAmount,
          firstPartyCommissionPercentage: dto.firstPartyCommissionPercentage,
          firstPartyCommissionAmount:
            dto.firstPartyCommissionAmount ??
            resolved.headerFromTerms?.firstPartyCommissionAmount,
          secondPartyCommissionPercentage: dto.secondPartyCommissionPercentage,
          secondPartyCommissionAmount:
            dto.secondPartyCommissionAmount ??
            resolved.headerFromTerms?.secondPartyCommissionAmount,
          totalAmount: crm.totalAmount ?? dto.totalAmount,
          monthlyAmount: crm.monthlyAmount ?? dto.monthlyAmount,
          depositAmount: crm.depositAmount ?? dto.depositAmount,
          startDate:
            crm.startDate !== undefined
              ? crm.startDate
              : dto.startDate
                ? new Date(dto.startDate)
                : undefined,
          endDate:
            crm.endDate !== undefined
              ? crm.endDate
              : dto.endDate
                ? new Date(dto.endDate)
                : undefined,
          deliveryDate:
            crm.deliveryDate !== undefined
              ? crm.deliveryDate
              : dto.deliveryDate
                ? new Date(dto.deliveryDate)
                : undefined,
          officialDeedDate:
            crm.officialDeedDate !== undefined
              ? crm.officialDeedDate
              : dto.officialDeedDate
                ? new Date(dto.officialDeedDate)
                : undefined,
          termsAndConditions: dto.termsAndConditions as
            | Prisma.InputJsonValue
            | undefined,
          parties: { create: partyRows },
        },
        select: { id: true },
      });

      await this.upsertDetails(created.id, dto.contractType, resolved);
      await this.replaceLawyers(created.id, resolved.lawyers ?? dto.lawyers);

      return this.findOne(actor, created.id);
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
    const existing = await this.prisma.contract.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        organizationId: true,
        contractType: true,
        propertyId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Contract ${id} not found`);
    }

    assertCanAccessContract(actor, existing);

    const organizationId = existing.organizationId;
    const contractType = dto.contractType ?? existing.contractType;

    let propertyId = existing.propertyId;
    if (dto.property || dto.propertyId) {
      propertyId = await this.resolvePropertyId(actor, organizationId, {
        propertyId: dto.propertyId,
        property: dto.property,
      });
    }

    const shouldReplaceParties =
      dto.firstParty !== undefined ||
      dto.firstPartyId !== undefined ||
      dto.secondParty !== undefined ||
      dto.secondPartyId !== undefined ||
      dto.witnesses !== undefined ||
      dto.witnessIds !== undefined;

    let firstPartyId: string | undefined;
    let secondPartyId: string | undefined;
    let witnessIds: string[] | undefined;

    if (shouldReplaceParties) {
      firstPartyId = await this.resolvePartyId(
        actor,
        organizationId,
        dto.firstParty,
        dto.firstPartyId,
        'firstParty',
        true,
      );
      secondPartyId = await this.resolvePartyId(
        actor,
        organizationId,
        dto.secondParty,
        dto.secondPartyId,
        'secondParty',
        true,
      );
      witnessIds = await this.resolveWitnessIds(actor, organizationId, dto);

      if (!firstPartyId || !secondPartyId) {
        const current = await this.prisma.contractParty.findMany({
          where: { contractId: id },
          select: { role: true, partyId: true },
        });
        firstPartyId =
          firstPartyId ??
          current.find((p) => p.role === ContractPartyRole.FIRST_PARTY)
            ?.partyId;
        secondPartyId =
          secondPartyId ??
          current.find((p) => p.role === ContractPartyRole.SECOND_PARTY)
            ?.partyId;
        if (witnessIds === undefined) {
          witnessIds = current
            .filter((p) => p.role === ContractPartyRole.WITNESS)
            .map((p) => p.partyId);
        }
      }

      if (!firstPartyId || !secondPartyId) {
        throw new BadRequestException(
          'firstParty and secondParty must be resolvable when updating parties',
        );
      }

      await this.assertPropertyAndPartiesInOrg(organizationId, {
        propertyId,
        partyIds: [firstPartyId, secondPartyId, ...(witnessIds ?? [])],
      });
    } else if (propertyId !== existing.propertyId) {
      await this.assertPropertyAndPartiesInOrg(organizationId, {
        propertyId,
        partyIds: [],
      });
    }

    const hasTypedDetailsInput =
      dto.saleDetails !== undefined ||
      dto.rentDetails !== undefined ||
      dto.goodwillDetails !== undefined ||
      dto.preSaleDetails !== undefined ||
      dto.rescissionDetails !== undefined ||
      dto.cjvDetails !== undefined ||
      dto.termsAndConditions !== undefined ||
      dto.lawyers !== undefined;

    const resolved = hasTypedDetailsInput
      ? this.resolveDetailsAndLawyers(contractType, dto)
      : null;
    const crm = resolved
      ? this.deriveCrmColumns(contractType, resolved, dto)
      : {};

    try {
      await this.prisma.contract.update({
        where: { id },
        data: {
          contractType: dto.contractType,
          contractNumber: dto.contractNumber,
          description: dto.description,
          propertyId,
          contractDate: dto.contractDate,
          contractTime: dto.contractTime,
          notes: dto.notes,
          commissionCityRules: dto.commissionCityRules,
          commissionFactorNumber: dto.commissionFactorNumber,
          firstPartyFactorNumber: dto.firstPartyFactorNumber,
          secondPartyFactorNumber: dto.secondPartyFactorNumber,
          commissionPercentage: dto.commissionPercentage,
          commissionAmount: dto.commissionAmount,
          taxPercentage: dto.taxPercentage,
          taxAmount: dto.taxAmount,
          firstPartyCommissionPercentage: dto.firstPartyCommissionPercentage,
          firstPartyCommissionAmount: dto.firstPartyCommissionAmount,
          secondPartyCommissionPercentage: dto.secondPartyCommissionPercentage,
          secondPartyCommissionAmount: dto.secondPartyCommissionAmount,
          totalAmount:
            crm.totalAmount !== undefined ? crm.totalAmount : dto.totalAmount,
          monthlyAmount:
            crm.monthlyAmount !== undefined
              ? crm.monthlyAmount
              : dto.monthlyAmount,
          depositAmount:
            crm.depositAmount !== undefined
              ? crm.depositAmount
              : dto.depositAmount,
          startDate:
            crm.startDate !== undefined
              ? crm.startDate
              : dto.startDate === undefined
                ? undefined
                : dto.startDate
                  ? new Date(dto.startDate)
                  : null,
          endDate:
            crm.endDate !== undefined
              ? crm.endDate
              : dto.endDate === undefined
                ? undefined
                : dto.endDate
                  ? new Date(dto.endDate)
                  : null,
          deliveryDate:
            crm.deliveryDate !== undefined
              ? crm.deliveryDate
              : dto.deliveryDate === undefined
                ? undefined
                : dto.deliveryDate
                  ? new Date(dto.deliveryDate)
                  : null,
          officialDeedDate:
            crm.officialDeedDate !== undefined
              ? crm.officialDeedDate
              : dto.officialDeedDate === undefined
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
      });

      if (shouldReplaceParties && firstPartyId && secondPartyId) {
        await this.prisma.contractParty.deleteMany({ where: { contractId: id } });
        await this.prisma.contractParty.createMany({
          data: [
            {
              contractId: id,
              partyId: firstPartyId,
              role: ContractPartyRole.FIRST_PARTY,
            },
            {
              contractId: id,
              partyId: secondPartyId,
              role: ContractPartyRole.SECOND_PARTY,
            },
            ...(witnessIds ?? []).map((partyId) => ({
              contractId: id,
              partyId,
              role: ContractPartyRole.WITNESS,
            })),
          ],
        });
      }

      if (resolved) {
        await this.upsertDetails(id, contractType, resolved);
        if (dto.lawyers !== undefined || resolved.lawyers) {
          await this.replaceLawyers(id, resolved.lawyers ?? dto.lawyers);
        }
      }

      return this.findOne(actor, id);
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
        select: { id: true, organizationId: true, uploadedById: true },
      });
      if (!file) {
        throw new NotFoundException(`File ${dto.fileId} not found`);
      }
      if (!isAdmin(actor)) {
        const sameOrg =
          actor.organizationId &&
          file.organizationId &&
          actor.organizationId === file.organizationId;
        const ownUpload = file.uploadedById === actor.id;
        if (!sameOrg && !ownUpload) {
          throw new ForbiddenException(
            'fileId must belong to your organization',
          );
        }
      }
      if (
        file.organizationId &&
        file.organizationId !== contract.organizationId
      ) {
        throw new BadRequestException(
          'fileId must belong to the contract organization',
        );
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

  private async resolvePropertyId(
    actor: PublicUser,
    organizationId: string,
    dto: {
      propertyId?: string;
      property?: ContractPropertyInputDto;
    },
  ): Promise<string> {
    if (dto.property) {
      const nested = dto.property;
      if (nested.id) {
        const { id, organizationId: _org, ...patch } = nested;
        await this.propertiesService.update(
          actor,
          id,
          patch as UpdatePropertyDto,
        );
        return id;
      }

      if (!nested.title || !nested.propertyType) {
        throw new BadRequestException(
          'property.title and property.propertyType are required when creating a property',
        );
      }

      const created = await this.propertiesService.create(actor, {
        ...(nested as CreatePropertyDto),
        organizationId: nested.organizationId ?? organizationId,
        title: nested.title,
        propertyType: nested.propertyType as PropertyType,
      });
      return created.id;
    }

    if (dto.propertyId) {
      return dto.propertyId;
    }

    throw new BadRequestException(
      'Either propertyId or property must be provided',
    );
  }

  private async resolvePartyId(
    actor: PublicUser,
    organizationId: string,
    nested: ContractPartyInputDto | undefined,
    topLevelId: string | undefined,
    label: string,
    optional = false,
  ): Promise<string | undefined> {
    if (nested) {
      if (nested.id) {
        const { id, organizationId: _org, ...patch } = nested;
        await this.partiesService.update(actor, id, patch as UpdatePartyDto);
        return id;
      }

      if (!nested.type) {
        throw new BadRequestException(
          `${label}.type is required when creating a party`,
        );
      }

      const created = await this.partiesService.create(actor, {
        ...(nested as CreatePartyDto),
        organizationId: nested.organizationId ?? organizationId,
        type: nested.type as PartyType,
      });
      return created.id;
    }

    if (topLevelId) {
      return topLevelId;
    }

    if (optional) {
      return undefined;
    }

    throw new BadRequestException(
      `Either ${label}Id or ${label} must be provided`,
    );
  }

  private async resolveWitnessIds(
    actor: PublicUser,
    organizationId: string,
    dto: {
      witnessIds?: string[];
      witnesses?: ContractPartyInputDto[];
    },
  ): Promise<string[]> {
    const ids: string[] = [];

    if (dto.witnesses?.length) {
      for (const [index, witness] of dto.witnesses.entries()) {
        const id = await this.resolvePartyId(
          actor,
          organizationId,
          witness,
          undefined,
          `witnesses[${index}]`,
        );
        if (id) ids.push(id);
      }
    } else if (dto.witnessIds?.length) {
      ids.push(...dto.witnessIds);
    }

    return ids;
  }

  private resolveDetailsAndLawyers(
    contractType: ContractType,
    dto: {
      saleDetails?: SaleDetailsDto;
      rentDetails?: RentDetailsDto;
      goodwillDetails?: GoodwillDetailsDto;
      preSaleDetails?: PreSaleDetailsDto;
      rescissionDetails?: MutualRescissionDetailsDto;
      cjvDetails?: ConstructionJvDetailsDto;
      lawyers?: ContractLawyersDto;
      termsAndConditions?: Record<string, unknown>;
    },
  ): ResolvedDetails {
    const fromTerms = dto.termsAndConditions
      ? this.mapTermsToDetails(contractType, dto.termsAndConditions)
      : {};

    const typed: ResolvedDetails = {
      saleDetails: dto.saleDetails,
      rentDetails: dto.rentDetails,
      goodwillDetails: dto.goodwillDetails,
      preSaleDetails: dto.preSaleDetails,
      rescissionDetails: dto.rescissionDetails,
      cjvDetails: dto.cjvDetails,
      lawyers: dto.lawyers ?? fromTerms.lawyers,
      headerFromTerms: fromTerms.headerFromTerms,
    };

    switch (contractType) {
      case ContractType.SALE:
        typed.saleDetails = dto.saleDetails ?? fromTerms.saleDetails;
        break;
      case ContractType.RENT:
        typed.rentDetails = dto.rentDetails ?? fromTerms.rentDetails;
        break;
      case ContractType.GOODWILL:
        typed.goodwillDetails =
          dto.goodwillDetails ?? fromTerms.goodwillDetails;
        break;
      case ContractType.PRE_SALE:
        typed.preSaleDetails = dto.preSaleDetails ?? fromTerms.preSaleDetails;
        break;
      case ContractType.MUTUAL_RESCISSION:
        typed.rescissionDetails =
          dto.rescissionDetails ?? fromTerms.rescissionDetails;
        break;
      case ContractType.CONSTRUCTION_JOINT_VENTURE:
        typed.cjvDetails = dto.cjvDetails ?? fromTerms.cjvDetails;
        break;
      default:
        break;
    }

    return typed;
  }

  private mapTermsToDetails(
    contractType: ContractType,
    terms: Record<string, unknown>,
  ): ResolvedDetails {
    const asObj = (v: unknown): Record<string, unknown> =>
      v && typeof v === 'object' && !Array.isArray(v)
        ? (v as Record<string, unknown>)
        : {};

    const num = (v: unknown): number | undefined =>
      typeof v === 'number' && !Number.isNaN(v) ? v : undefined;
    const str = (v: unknown): string | undefined =>
      typeof v === 'string' ? v : undefined;

    const property = asObj(terms.property);
    const lawyersRaw = asObj(terms.lawyers);
    const commission = asObj(terms.commission);
    const contractMeta = asObj(terms.contract);

    const mapLawyer = (raw: unknown): LawyerDto | undefined => {
      const o = asObj(raw);
      if (!Object.keys(o).length) return undefined;
      return {
        name: str(o.name),
        fatherName: str(o.fatherName),
        identityNumber: str(o.identityNumber),
        birthPlace: str(o.birthPlace),
        birthDate: str(o.birthDate),
        identityExportPlace: str(o.identityExportPlace),
        nationalCode: str(o.nationalCode),
        address: str(o.address),
        postalCode: str(o.postalCode),
        cause: str(o.cause),
      };
    };

    const lawyers: ContractLawyersDto | undefined =
      lawyersRaw.firstParty || lawyersRaw.secondParty
        ? {
            firstParty: mapLawyer(lawyersRaw.firstParty),
            secondParty: mapLawyer(lawyersRaw.secondParty),
          }
        : undefined;

    const headerFromTerms = {
      contractDate: str(contractMeta.date),
      contractTime: str(contractMeta.time),
      description: str(contractMeta.description),
      notes: str(terms.notes),
      commissionCityRules: str(commission.cityRules),
      commissionFactorNumber: str(commission.factorNumber),
      commissionAmount: num(commission.amount),
      firstPartyCommissionAmount: num(commission.firstPartyAmount),
      secondPartyCommissionAmount: num(commission.secondPartyAmount),
      taxPercentage: num(commission.taxPercent),
      taxAmount: num(commission.amountWithTax),
    };

    const result: ResolvedDetails = { lawyers, headerFromTerms };

    switch (contractType) {
      case ContractType.SALE: {
        const sale = asObj(terms.sale);
        result.saleDetails = {
          shareUnits:
            num(terms.shareUnits) ?? num(property.shareUnits),
          pricePerSqm: num(property.pricePerSqm),
          totalAmount: num(sale.totalAmount),
          totalInWords: str(sale.totalInWords),
          prePaymentAmount: num(sale.prePaymentAmount),
          prePaymentChequeNumber: str(sale.prePaymentChequeNumber),
          prePaymentBankName: str(sale.prePaymentBankName),
          prePaymentBankBranch: str(sale.prePaymentBankBranch),
          remainderAmount: num(sale.remainderAmount),
          voucherRegistrationDate: str(sale.voucherRegistrationDate),
          voucherOrganizationNumber: str(sale.voucherOrganizationNumber),
          deliveryDate: str(sale.deliveryDate),
          cancelationPenalty: str(sale.cancelationPenalty),
          breachPenalty: str(sale.breachPenalty),
          notaryFeePayer: str(sale.notaryFeePayer),
          delayPenaltyFirstPartyPerDay: num(sale.delayPenaltyFirstPartyPerDay),
          delayPenaltySecondPartyPerDay: num(
            sale.delayPenaltySecondPartyPerDay,
          ),
        };
        break;
      }
      case ContractType.RENT: {
        const rent = asObj(terms.rent);
        result.rentDetails = {
          shareUnits:
            num(terms.shareUnits) ?? num(property.shareUnits),
          durationMonths: num(rent.durationMonths),
          fromDate: str(rent.fromDate),
          toDate: str(rent.toDate),
          monthlyAmount: num(rent.monthlyAmount),
          monthlyInWords: str(rent.monthlyInWords),
          mortgageAmount: num(rent.mortgageAmount),
          mortgageInWords: str(rent.mortgageInWords),
          totalInWords: str(rent.totalInWords),
          prePaymentAmount: num(rent.prePaymentAmount),
          prePaymentChequeNumber: str(rent.prePaymentChequeNumber),
          prePaymentBankName: str(rent.prePaymentBankName),
          prePaymentBankBranch: str(rent.prePaymentBankBranch),
          remainderAmount: num(rent.remainderAmount),
          remainderDueDate: str(rent.remainderDueDate),
          deliveryDate: str(rent.deliveryDate),
          cancelationPenalty: str(rent.cancelationPenalty),
          breachPenalty: str(rent.breachPenalty),
          notaryFeePayer: str(rent.notaryFeePayer),
          delayPenaltyFirstPartyPerDay: num(rent.delayPenaltyFirstPartyPerDay),
          delayPenaltySecondPartyPerDay: num(
            rent.delayPenaltySecondPartyPerDay,
          ),
          propertyOwnerName: str(rent.propertyOwnerName),
        };
        break;
      }
      case ContractType.GOODWILL: {
        const goodwill = asObj(terms.goodwill);
        result.goodwillDetails = {
          shareUnits:
            num(terms.shareUnits) ?? num(property.shareUnits),
          pricePerSqm: num(property.pricePerSqm),
          totalAmount: num(goodwill.totalAmount),
          prePaymentAmount: num(goodwill.prePaymentAmount),
          prePaymentChequeNumber: str(goodwill.prePaymentChequeNumber),
          prePaymentBankName: str(goodwill.prePaymentBankName),
          prePaymentBankBranch: str(goodwill.prePaymentBankBranch),
          remainderAmount: num(goodwill.remainderAmount),
          remainderDueDate: str(goodwill.remainderDueDate),
          penaltyAmount: str(goodwill.penaltyAmount),
          deliveryDate: str(goodwill.deliveryDate),
        };
        break;
      }
      case ContractType.PRE_SALE: {
        const presale = asObj(terms.presale);
        result.preSaleDetails = {
          renovationCode: str(presale.renovationCode),
          technicalIdNumber: str(presale.technicalIdNumber),
          insuranceNumber: str(presale.insuranceNumber),
          buildingPermitNumber: str(presale.buildingPermitNumber),
          buildingPermitDate: str(presale.buildingPermitDate),
          equipped: str(presale.equipped),
          totalFloors: num(presale.totalFloors),
          totalUnits: num(presale.totalUnits),
          areaSqm: num(presale.areaSqm),
          storage: str(presale.storage),
          orientation: str(presale.orientation),
          parkingNumberAndArea: str(presale.parkingNumberAndArea),
          flooringType: str(presale.flooringType),
          cabinetAndFaucetType: str(presale.cabinetAndFaucetType),
          bathroomType: str(presale.bathroomType),
          switchOutletType: str(presale.switchOutletType),
          entranceDoorType: str(presale.entranceDoorType),
          interiorDoorType: str(presale.interiorDoorType),
          ceilingPlasterType: str(presale.ceilingPlasterType),
          emergencyWaterSourceType: str(presale.emergencyWaterSourceType),
          heatingType: str(presale.heatingType),
          coolerType: str(presale.coolerType),
          intercomType: str(presale.intercomType),
          cctv: str(presale.cctv),
          tilingType: str(presale.tilingType),
          windowType: str(presale.windowType),
          facadeType: str(presale.facadeType),
          parkingFloorWallCover: str(presale.parkingFloorWallCover),
          lighting: str(presale.lighting),
          balconyCorridorRailing: str(presale.balconyCorridorRailing),
          fireExtinguisher: str(presale.fireExtinguisher),
          elevator: str(presale.elevator),
          waterMotor: str(presale.waterMotor),
          utilitiesScore: str(presale.utilitiesScore),
          loan: str(presale.loan),
          loanType: str(presale.loanType),
          loanInstallmentAmount: num(presale.loanInstallmentAmount),
          totalAmount: num(presale.totalAmount),
          totalInWords: str(presale.totalInWords),
          deliveryDate: str(presale.deliveryDate),
          deedTransferDate: str(presale.deedTransferDate),
          selfDeclareFormNumber: str(presale.selfDeclareFormNumber),
          voucherOrganizationNumber: str(presale.voucherOrganizationNumber),
        };
        break;
      }
      case ContractType.MUTUAL_RESCISSION: {
        const rescission = asObj(terms.rescission);
        result.rescissionDetails = {
          originalContractNumber: str(rescission.originalContractNumber),
          originalContractDate: str(rescission.originalContractDate),
          originalAgencyName: str(rescission.originalAgencyName),
          shareUnits: num(property.shareUnits),
          areaSqm: num(property.areaSqm),
          county: str(property.county),
          ownershipNumber: str(property.ownershipNumber),
          aggregationClause: str(rescission.aggregationClause),
          deliveryClause: str(rescission.deliveryClause),
          price: num(rescission.price),
          paymentType: str(rescission.paymentType),
        };
        break;
      }
      case ContractType.CONSTRUCTION_JOINT_VENTURE: {
        const cjv = asObj(terms.cjv);
        result.cjvDetails = {
          propertyDescription: str(cjv.propertyDescription),
          shareUnits:
            num(terms.shareUnits) ?? num(property.shareUnits),
          areaSqm: num(property.areaSqm),
          totalAmount: num(cjv.totalAmount),
          totalInWords: str(cjv.totalInWords),
          governmentalCosts: num(cjv.governmentalCosts),
          constructionCosts: num(cjv.constructionCosts),
          facilityRightsCosts: num(cjv.facilityRightsCosts),
          destructionCost: num(cjv.destructionCost),
          firstPartyShare: str(cjv.firstPartyShare),
          secondPartyShare: str(cjv.secondPartyShare),
          startDateInWords: str(cjv.startDateInWords),
          endDateInWords: str(cjv.endDateInWords),
          costDetailsPrepareDate: str(cjv.costDetailsPrepareDate),
          voucherTransferDate: str(cjv.voucherTransferDate),
          shareUnitsToTransfer: str(cjv.shareUnitsToTransfer),
          delayPenaltyFirstPartyPerDay: num(cjv.delayPenaltyFirstPartyPerDay),
          delayPenaltySecondPartyPerDay: num(
            cjv.delayPenaltySecondPartyPerDay,
          ),
        };
        break;
      }
      default:
        break;
    }

    return result;
  }

  private deriveCrmColumns(
    contractType: ContractType,
    resolved: ResolvedDetails,
    dto: {
      totalAmount?: number;
      monthlyAmount?: number;
      depositAmount?: number;
      startDate?: string;
      endDate?: string;
      deliveryDate?: string;
      officialDeedDate?: string;
    },
  ): CrmSync {
    const crm: CrmSync = {};

    const tryParseDate = (value?: string): Date | undefined => {
      if (!value) return undefined;
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? undefined : d;
    };

    switch (contractType) {
      case ContractType.SALE:
        if (resolved.saleDetails?.totalAmount !== undefined) {
          crm.totalAmount = resolved.saleDetails.totalAmount;
        }
        if (resolved.saleDetails?.deliveryDate) {
          crm.deliveryDate =
            tryParseDate(resolved.saleDetails.deliveryDate) ?? undefined;
        }
        break;
      case ContractType.RENT:
        if (resolved.rentDetails?.monthlyAmount !== undefined) {
          crm.monthlyAmount = resolved.rentDetails.monthlyAmount;
        }
        if (resolved.rentDetails?.mortgageAmount !== undefined) {
          crm.depositAmount = resolved.rentDetails.mortgageAmount;
        }
        if (resolved.rentDetails?.fromDate) {
          crm.startDate =
            tryParseDate(resolved.rentDetails.fromDate) ?? undefined;
        }
        if (resolved.rentDetails?.toDate) {
          crm.endDate = tryParseDate(resolved.rentDetails.toDate) ?? undefined;
        }
        if (resolved.rentDetails?.deliveryDate) {
          crm.deliveryDate =
            tryParseDate(resolved.rentDetails.deliveryDate) ?? undefined;
        }
        break;
      case ContractType.GOODWILL:
        if (resolved.goodwillDetails?.totalAmount !== undefined) {
          crm.totalAmount = resolved.goodwillDetails.totalAmount;
        }
        if (resolved.goodwillDetails?.deliveryDate) {
          crm.deliveryDate =
            tryParseDate(resolved.goodwillDetails.deliveryDate) ?? undefined;
        }
        break;
      case ContractType.PRE_SALE:
        if (resolved.preSaleDetails?.totalAmount !== undefined) {
          crm.totalAmount = resolved.preSaleDetails.totalAmount;
        }
        if (resolved.preSaleDetails?.deliveryDate) {
          crm.deliveryDate =
            tryParseDate(resolved.preSaleDetails.deliveryDate) ?? undefined;
        }
        if (resolved.preSaleDetails?.deedTransferDate) {
          crm.officialDeedDate =
            tryParseDate(resolved.preSaleDetails.deedTransferDate) ?? undefined;
        }
        break;
      case ContractType.MUTUAL_RESCISSION:
        if (resolved.rescissionDetails?.price !== undefined) {
          crm.totalAmount = resolved.rescissionDetails.price;
        }
        break;
      case ContractType.CONSTRUCTION_JOINT_VENTURE:
        if (resolved.cjvDetails?.totalAmount !== undefined) {
          crm.totalAmount = resolved.cjvDetails.totalAmount;
        }
        break;
      default:
        break;
    }

    if (dto.totalAmount !== undefined && crm.totalAmount === undefined) {
      crm.totalAmount = dto.totalAmount;
    }
    if (dto.monthlyAmount !== undefined && crm.monthlyAmount === undefined) {
      crm.monthlyAmount = dto.monthlyAmount;
    }
    if (dto.depositAmount !== undefined && crm.depositAmount === undefined) {
      crm.depositAmount = dto.depositAmount;
    }

    return crm;
  }

  private async upsertDetails(
    contractId: string,
    contractType: ContractType,
    resolved: ResolvedDetails,
  ): Promise<void> {
    switch (contractType) {
      case ContractType.SALE:
        if (resolved.saleDetails) {
          const data = this.omitUndefined(resolved.saleDetails);
          await this.prisma.saleContractDetails.upsert({
            where: { contractId },
            create: { contractId, ...data },
            update: data,
          });
        }
        break;
      case ContractType.RENT:
        if (resolved.rentDetails) {
          const data = this.omitUndefined(resolved.rentDetails);
          await this.prisma.rentContractDetails.upsert({
            where: { contractId },
            create: { contractId, ...data },
            update: data,
          });
        }
        break;
      case ContractType.GOODWILL:
        if (resolved.goodwillDetails) {
          const data = this.omitUndefined(resolved.goodwillDetails);
          await this.prisma.goodwillContractDetails.upsert({
            where: { contractId },
            create: { contractId, ...data },
            update: data,
          });
        }
        break;
      case ContractType.PRE_SALE:
        if (resolved.preSaleDetails) {
          const data = this.omitUndefined(resolved.preSaleDetails);
          await this.prisma.preSaleContractDetails.upsert({
            where: { contractId },
            create: { contractId, ...data },
            update: data,
          });
        }
        break;
      case ContractType.MUTUAL_RESCISSION:
        if (resolved.rescissionDetails) {
          const data = this.omitUndefined(resolved.rescissionDetails);
          await this.prisma.mutualRescissionContractDetails.upsert({
            where: { contractId },
            create: { contractId, ...data },
            update: data,
          });
        }
        break;
      case ContractType.CONSTRUCTION_JOINT_VENTURE:
        if (resolved.cjvDetails) {
          const data = this.omitUndefined(resolved.cjvDetails);
          await this.prisma.constructionJvContractDetails.upsert({
            where: { contractId },
            create: { contractId, ...data },
            update: data,
          });
        }
        break;
      default:
        break;
    }
  }

  private async replaceLawyers(
    contractId: string,
    lawyers?: ContractLawyersDto,
  ): Promise<void> {
    if (lawyers === undefined) return;

    await this.prisma.contractLawyer.deleteMany({ where: { contractId } });

    const rows: Prisma.ContractLawyerCreateManyInput[] = [];
    if (lawyers.firstParty) {
      rows.push({
        contractId,
        side: ContractLawyerSide.FIRST_PARTY,
        ...this.omitUndefined(lawyers.firstParty),
      });
    }
    if (lawyers.secondParty) {
      rows.push({
        contractId,
        side: ContractLawyerSide.SECOND_PARTY,
        ...this.omitUndefined(lawyers.secondParty),
      });
    }

    if (rows.length) {
      await this.prisma.contractLawyer.createMany({ data: rows });
    }
  }

  private omitUndefined<T extends object>(obj: T): Partial<T> {
    const out: Partial<T> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        (out as Record<string, unknown>)[key] = value;
      }
    }
    return out;
  }

  private async assertPropertyAndPartiesInOrg(
    organizationId: string,
    args: { propertyId: string; partyIds: string[] },
  ): Promise<void> {
    const property = await this.prisma.property.findFirst({
      where: { id: args.propertyId, deletedAt: null },
      select: { id: true, organizationId: true },
    });

    if (!property) {
      throw new NotFoundException(`Property ${args.propertyId} not found`);
    }

    if (property.organizationId !== organizationId) {
      throw new BadRequestException(
        'Property must belong to the contract organization',
      );
    }

    if (!args.partyIds.length) return;

    const uniquePartyIds = [...new Set(args.partyIds)];
    if (uniquePartyIds.length !== args.partyIds.length) {
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
      saleDetails: this.mapDetailsDecimals(row.saleDetails),
      rentDetails: this.mapDetailsDecimals(row.rentDetails),
      goodwillDetails: this.mapDetailsDecimals(row.goodwillDetails),
      preSaleDetails: this.mapDetailsDecimals(row.preSaleDetails),
      rescissionDetails: this.mapDetailsDecimals(row.rescissionDetails),
      cjvDetails: this.mapDetailsDecimals(row.cjvDetails),
    };
  }

  private mapDetailsDecimals(
    details: Record<string, unknown> | null | undefined,
  ): Record<string, unknown> | null {
    if (!details) return null;

    const out: Record<string, unknown> = { ...details };
    for (const [key, value] of Object.entries(out)) {
      if (
        value !== null &&
        value !== undefined &&
        typeof value === 'object' &&
        'toFixed' in (value as object)
      ) {
        out[key] = this.decimalToString(value as Prisma.Decimal);
      }
    }
    return out;
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
