import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AddressesModule } from './addresses/addresses.module';
import { AuthModule } from './auth/auth.module';
import {
  getThrottleLimit,
  getThrottleTtlMs,
} from './common/config/security.config';
import { ContractsModule } from './contracts/contracts.module';
import { FilesModule } from './files/files.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PartiesModule } from './parties/parties.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrintLayoutsModule } from './print-layouts/print-layouts.module';
import { PropertiesModule } from './properties/properties.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: getThrottleTtlMs(),
        limit: getThrottleLimit(),
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    AddressesModule,
    PropertiesModule,
    PartiesModule,
    ContractsModule,
    FilesModule,
    PrintLayoutsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
