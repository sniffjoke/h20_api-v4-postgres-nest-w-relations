import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SETTINGS } from './core/settings/settings';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './features/users/users.module';
import { TestingModule } from './features/testing/testing.module';
import { TokensModule } from './features/tokens/tokens.module';
import { DevicesModule } from './features/devices/devices.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './features/auth/auth.module';
import { UserIsExistConstraint } from './core/decorators/async/user-is-exist.decorator';
import { BlogsModule } from './features/blogs/blogs.module';
import { CqrsModule } from '@nestjs/cqrs';
import configuration, { validate } from './core/settings/configuration';
import { Environments } from './core/settings/env/env-settings';

// import configuration from './core/settings/configuration';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: 5,
    }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      ignoreEnvFile:
        process.env.ENV !== Environments.DEVELOPMENT &&
        process.env.ENV !== Environments.TEST &&
        process.env.ENV !== Environments.PRODUCTION,
      // envFilePath: ['.development.env', '.test.env'],
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: SETTINGS.PATH.HOST,
      port: Number(SETTINGS.PORT_DB) || 5432,
      username: SETTINGS.PATH.USERNAME,
      password: SETTINGS.PATH.PASSWORD,
      database: SETTINGS.PATH.DATABASE,
      // entities: [],
      ssl: true,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
    }),
    BlogsModule,
    UsersModule,
    TestingModule,
    AuthModule,
    TokensModule,
    DevicesModule,
  ],
  controllers: [],
  providers: [
    UserIsExistConstraint,
  ],
})
export class AppModule {
}
