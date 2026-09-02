import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractType, Prisma } from '@prisma/client';
import {
  assertCanAccessOrganization,
  isAdmin,
} from '../common/utils/access-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';
import {
  PrintFieldBoxDto,
  UpsertPrintLayoutDto,
} from './dto/print-layout.dto';
import { isAllowedPrintField, PRINT_FIELD_CATALOG } from './print-field-catalog';

const layoutSelect = {
  id: true,
  organizationId: true,
  contractType: true,
  paperWidthMm: true,
  paperHeightMm: true,
  fields: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ContractPrintLayoutSelect;

/** Any member of the org (or admin) may read layouts for contract preview. */
function assertCanReadOrgLayouts(
  actor: PublicUser,
  organizationId: string,
): void {
  if (isAdmin(actor)) return;
  if (actor.organizationId === organizationId) return;
  throw new ForbiddenException('You do not have access to this organization');
}

@Injectable()
export class PrintLayoutsService {
  constructor(private readonly prisma: PrismaService) {}

  getCatalog() {
    return PRINT_FIELD_CATALOG;
  }

  async findAll(actor: PublicUser, organizationId: string) {
    assertCanReadOrgLayouts(actor, organizationId);
    return this.prisma.contractPrintLayout.findMany({
      where: { organizationId },
      select: layoutSelect,
      orderBy: { contractType: 'asc' },
    });
  }

  async findOne(
    actor: PublicUser,
    organizationId: string,
    contractType: ContractType,
  ) {
    assertCanReadOrgLayouts(actor, organizationId);
    const layout = await this.prisma.contractPrintLayout.findUnique({
      where: {
        organizationId_contractType: { organizationId, contractType },
      },
      select: layoutSelect,
    });

    if (!layout) {
      throw new NotFoundException(
        `Print layout for ${contractType} not found in this organization`,
      );
    }

    return layout;
  }

  async upsert(
    actor: PublicUser,
    organizationId: string,
    contractType: ContractType,
    dto: UpsertPrintLayoutDto,
  ) {
    assertCanAccessOrganization(actor, organizationId);

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });
    if (!org) {
      throw new NotFoundException(`Organization ${organizationId} not found`);
    }

    const paperWidthMm = dto.paperWidthMm ?? 297;
    const paperHeightMm = dto.paperHeightMm ?? 420;
    this.validateFields(contractType, dto.fields, paperWidthMm, paperHeightMm);

    return this.prisma.contractPrintLayout.upsert({
      where: {
        organizationId_contractType: { organizationId, contractType },
      },
      create: {
        organizationId,
        contractType,
        paperWidthMm,
        paperHeightMm,
        fields: dto.fields as unknown as Prisma.InputJsonValue,
      },
      update: {
        paperWidthMm,
        paperHeightMm,
        fields: dto.fields as unknown as Prisma.InputJsonValue,
      },
      select: layoutSelect,
    });
  }

  private validateFields(
    contractType: ContractType,
    fields: Record<string, PrintFieldBoxDto>,
    paperWidthMm: number,
    paperHeightMm: number,
  ) {
    for (const [key, box] of Object.entries(fields)) {
      if (!isAllowedPrintField(contractType, key)) {
        throw new BadRequestException(
          `Unknown print field "${key}" for contract type ${contractType}`,
        );
      }
      if (!box?.start || !box?.end) {
        throw new BadRequestException(
          `Field "${key}" must include start and end points`,
        );
      }
      this.assertPointInPaper(key, 'start', box.start, paperWidthMm, paperHeightMm);
      this.assertPointInPaper(key, 'end', box.end, paperWidthMm, paperHeightMm);
    }
  }

  private assertPointInPaper(
    fieldKey: string,
    which: 'start' | 'end',
    point: { x: number; y: number },
    width: number,
    height: number,
  ) {
    if (
      point.x < 0 ||
      point.y < 0 ||
      point.x > width ||
      point.y > height
    ) {
      throw new BadRequestException(
        `Field "${fieldKey}" ${which} point (${point.x}, ${point.y}) is outside paper ${width}×${height} mm`,
      );
    }
  }
}
