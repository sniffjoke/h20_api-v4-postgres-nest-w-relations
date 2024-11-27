import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from "cors-ts";
import { useContainer } from "class-validator";
import { BadRequestExceptionFilter } from './core/exceptions/exception-filters/bad-request-exception-filter';
import cookieParser from 'cookie-parser'
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from './core/settings/env/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true
  });
  // app.setGlobalPrefix('api')
  app.use(cors({
    // credentials: true,
  }))
  // console.log('process.env: ', process.env);
  app.useGlobalFilters(new BadRequestExceptionFilter())
  useContainer(app.select(AppModule), {fallbackOnErrors: true})
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors = [];
        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints as any);
          constraintKeys.forEach((cKey, index) => {
            if (index >= 1) return;
            const msg = e.constraints?.[cKey] as any;
            // @ts-ignore
            customErrors.push({ field: e.property, message: msg });
          });
        });
        throw new BadRequestException(customErrors);
      },
    }),
  );
  app.use(cookieParser())
  const configService = app.get(ConfigService<ConfigurationType, true>);
  const apiSettings = configService.get('apiSettings', { infer: true });
  const environmentSettings = configService.get('environmentSettings', {
    infer: true,
  });
  await app.listen(
    apiSettings.PORT,
    () => {
      console.log('DB connect');
      console.log('Port: ', apiSettings.PORT);
      console.log('ENV: ', environmentSettings.currentEnv);
    }
  );
}
bootstrap();
