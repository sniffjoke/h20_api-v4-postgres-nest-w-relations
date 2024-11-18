import { Module } from '@nestjs/common';
import { DevicesController } from './api/devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DevicesRepository } from './infrastructure/devices.repository';
import { TokensModule } from '../tokens/tokens.module';
import { UsersModule } from '../users/users.module';
import { DevicesCommandHandlers } from './application/useCases';

@Module({
  imports: [
    UsersModule,
    TokensModule,
    TypeOrmModule.forFeature([]),
  ],
  controllers: [DevicesController],
  providers: [
    DevicesRepository,
    ...DevicesCommandHandlers
  ],
  exports: [
    DevicesRepository,
    ...DevicesCommandHandlers
  ]
})
export class DevicesModule {}
