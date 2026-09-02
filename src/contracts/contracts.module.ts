import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PartiesModule } from '../parties/parties.module';
import { PropertiesModule } from '../properties/properties.module';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [AuthModule, PartiesModule, PropertiesModule],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
