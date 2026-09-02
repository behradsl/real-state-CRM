import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { SESSION_COOKIE_NAME } from '../auth/auth.constants';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PublicUser } from '../users/users.service';
import { FileResponseDto } from './dto/file-response.dto';
import { FilesService } from './files.service';

@ApiTags('Files')
@ApiCookieAuth(SESSION_COOKIE_NAME)
@Controller('files')
@UseGuards(SessionAuthGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload a file',
    description:
      'Stores PDF/JPEG/PNG/WebP under a private uploads directory. Use GET /files/:id/download to fetch content. Use the id as fileId on contract signatures.',
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  upload(
    @CurrentUser() actor: PublicUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.filesService.upload(actor, file);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file metadata by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'File metadata',
    type: FileResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'File not found' })
  findOne(@CurrentUser() actor: PublicUser, @Param('id') id: string) {
    return this.filesService.findOne(actor, id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download file content (authenticated)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiProduces('application/octet-stream')
  @ApiResponse({ status: 200, description: 'File bytes' })
  @Header('X-Content-Type-Options', 'nosniff')
  download(
    @CurrentUser() actor: PublicUser,
    @Param('id') id: string,
  ): Promise<StreamableFile> {
    return this.filesService.download(actor, id);
  }
}
