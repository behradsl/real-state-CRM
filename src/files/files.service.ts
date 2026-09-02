import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { isAdmin } from '../common/utils/access-scope.util';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';

const ALLOWED_MIME_TO_EXT: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

export type PublicFile = {
  id: string;
  organizationId: string | null;
  uploadedById: string;
  name: string;
  path: string;
  contentType: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class FilesService {
  private readonly uploadRoot = join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {
    if (!existsSync(this.uploadRoot)) {
      mkdirSync(this.uploadRoot, { recursive: true });
    }
  }

  async upload(
    actor: PublicUser,
    file?: Express.Multer.File,
  ): Promise<PublicFile> {
    if (!file) {
      throw new BadRequestException('file is required');
    }

    const mime = (file.mimetype || '').toLowerCase();
    const ext = ALLOWED_MIME_TO_EXT[mime];
    if (!ext) {
      throw new BadRequestException(
        `Unsupported file type. Allowed: ${Object.keys(ALLOWED_MIME_TO_EXT).join(', ')}`,
      );
    }

    const storedName = `${randomUUID()}${ext}`;
    const absolutePath = join(this.uploadRoot, storedName);
    // Ensure resolved path stays under uploadRoot
    if (!absolutePath.startsWith(this.uploadRoot)) {
      throw new BadRequestException('Invalid storage path');
    }

    const { writeFile } = await import('fs/promises');
    await writeFile(absolutePath, file.buffer);

    const safeOriginal =
      file.originalname.replace(/[\\/]/g, '_').slice(0, 200) ||
      `upload${ext}`;

    return this.prisma.file.create({
      data: {
        organizationId: actor.organizationId,
        uploadedById: actor.id,
        name: safeOriginal,
        path: storedName,
        contentType: mime,
        size: file.size,
      },
    });
  }

  async findOne(actor: PublicUser, id: string): Promise<PublicFile> {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File ${id} not found`);
    }
    this.assertCanAccessFile(actor, file);
    return file;
  }

  async download(actor: PublicUser, id: string): Promise<StreamableFile> {
    const file = await this.findOne(actor, id);
    const absolutePath = join(this.uploadRoot, file.path);
    if (
      !absolutePath.startsWith(this.uploadRoot) ||
      !existsSync(absolutePath)
    ) {
      throw new NotFoundException(`File ${id} content not found`);
    }

    const stream = createReadStream(absolutePath);
    return new StreamableFile(stream, {
      type: file.contentType,
      disposition: `attachment; filename="${encodeURIComponent(file.name)}"`,
      length: file.size,
    });
  }

  assertCanAccessFile(
    actor: PublicUser,
    file: { organizationId: string | null; uploadedById: string },
  ): void {
    if (isAdmin(actor)) return;
    if (file.uploadedById === actor.id) return;
    if (
      actor.organizationId &&
      file.organizationId &&
      actor.organizationId === file.organizationId
    ) {
      return;
    }
    throw new ForbiddenException('You do not have access to this file');
  }
}
