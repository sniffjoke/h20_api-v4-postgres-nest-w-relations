import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { applyAppSettings } from '../../src/core/settings/apply-app.settings';
import { BlogsTestManager } from './test-helpers';
import { deleteAllData } from './delete-all-data';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../src/core/settings/env/configuration';

export const initSettings = async (
  //передаем callback, который получает ModuleBuilder,
  // если хотим изменить настройку тестового модуля
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  })
    // .overrideProvider('')
    // .useClass('')

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile();

  const app = testingAppModule.createNestApplication();

  applyAppSettings(app);

  await app.init();

  const configService = app.get(ConfigService<ConfigurationType, true>);
  const apiSettings = configService.get('apiSettings', { infer: true });
  const httpServer = app.getHttpServer();
  const blogTestManger = new BlogsTestManager(app, configService);

  await deleteAllData(app);

  return {
    app,
    httpServer,
    blogTestManger,
    configService,
    apiSettings
  };
};
