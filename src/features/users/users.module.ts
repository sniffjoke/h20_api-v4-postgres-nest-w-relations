import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersController } from './api/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UuidModule } from 'nestjs-uuid';
import { CryptoModule } from '../../core/modules/crypto/crypto.module';
import { UsersQueryRepository } from './infrastructure/users.query-repositories';
import { UsersCommandHandlers } from './application/useCases';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
    CryptoModule,
    UuidModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    ...UsersCommandHandlers
  ],
  exports: [
    CryptoModule,
    UuidModule,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    ...UsersCommandHandlers
  ],
})
export class UsersModule {
}
