import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrintLayoutsController } from './print-layouts.controller';
import { PrintLayoutsService } from './print-layouts.service';

@Module({
  imports: [AuthModule],
  controllers: [PrintLayoutsController],
  providers: [PrintLayoutsService],
  exports: [PrintLayoutsService],
})
export class PrintLayoutsModule {}
