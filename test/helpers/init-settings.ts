import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/core/settings/apply-app.settings';
import { AuthTestManager, BlogsTestManager, PostsTestManager, UsersTestManager } from './test-helpers';
import { deleteAllData } from './delete-all-data';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../src/core/settings/env/configuration';
import { UsersService } from '../../src/features/users/application/users.service';
import { EmailServiceMock } from '../mock/email-service.mock';
import { TokensService } from '../../src/features/tokens/application/tokens.service';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder,
  // если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [
      AppModule
    ],
  })
    // .overrideProvider(UsersService)
    // .useClass(EmailServiceMock)

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile();

  const app = testingAppModule.createNestApplication();

  applyAppSettings(app);

  await app.init();

  const configService = app.get(ConfigService<ConfigurationType, true>);
  const usersService = app.get<UsersService>(UsersService);
  const tokensService = app.get<TokensService>(TokensService);
  const apiSettings = configService.get('apiSettings', { infer: true });
  const httpServer = app.getHttpServer();
  const blogTestManager = new BlogsTestManager(app, configService);
  const postTestManager = new PostsTestManager(app, configService);
  const userTestManager = new UsersTestManager(app, configService);
  const authTestManager = new AuthTestManager(app, configService);

  await deleteAllData(app);

  return {
    app,
    httpServer,
    blogTestManager,
    postTestManager,
    configService,
    apiSettings,
    userTestManager,
    usersService,
    authTestManager,
    tokensService
  };
};
