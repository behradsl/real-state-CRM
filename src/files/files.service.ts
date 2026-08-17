import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { PublicUser } from '../users/users.service';

export type PublicFile = {
  id: string;
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
    _actor: PublicUser,
    file?: Express.Multer.File,
  ): Promise<PublicFile> {
    if (!file) {
      throw new BadRequestException('file is required');
    }

    const extension = file.originalname.includes('.')
      ? file.originalname.slice(file.originalname.lastIndexOf('.'))
      : '';
    const storedName = `${randomUUID()}${extension}`;
    const absolutePath = join(this.uploadRoot, storedName);

    const { writeFile } = await import('fs/promises');
    await writeFile(absolutePath, file.buffer);

    const publicPath = `/uploads/${storedName}`;

    return this.prisma.file.create({
      data: {
        name: file.originalname,
        path: publicPath,
        contentType: file.mimetype || 'application/octet-stream',
        size: file.size,
      },
    });
  }

  async findOne(_actor: PublicUser, id: string): Promise<PublicFile> {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File ${id} not found`);
    }
    return file;
  }
}
