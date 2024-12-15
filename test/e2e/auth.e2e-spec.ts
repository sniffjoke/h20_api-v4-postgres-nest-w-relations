import { INestApplication } from '@nestjs/common';
import {
  AuthTestManager,
  BlogsTestManager,
  checkWebsiteString,
  createMockBlog,
  createMockUser, mockLoginData,
  UsersTestManager,
} from '../helpers/test-helpers';
import { initSettings } from '../helpers/init-settings';
import { deleteAllData } from '../helpers/delete-all-data';
import { UsersService } from '../../src/features/users/application/users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../../src/features/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../src/core/settings/env/configuration';
import { TokensService } from '../../src/features/tokens/application/tokens.service';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersManager: UsersTestManager;
  let usersService: UsersService;
  let authManager: AuthTestManager;
  let refreshToken: string
  let tokensService: TokensService;


  beforeAll(async () => {
    const result = await initSettings(
      (moduleBuilder) =>
        moduleBuilder
          .overrideProvider(JwtService)
          .useValue(
            new JwtService({
              secret: 'secret_key',
              signOptions: { expiresIn: '2s' },
            }),
          ),
    );
    app = result.app;
    usersManager = result.userTestManager;
    usersService = result.usersService;
    authManager = result.authTestManager;
    tokensService = result.tokensService
    await deleteAllData(app);
  });

  afterAll(async () => {
    await app.close();
  });

  // beforeEach(async () => {
  //   await deleteAllData(app);
  // });

  describe('/auth (e2e)', () => {
    it('/auth/login (POST)', async () => {
      const emailConfirmationInfo = usersService.createEmailConfirmation(true);
      const createUser = await usersManager.createUser(createMockUser(1), emailConfirmationInfo);
      const loginUser = await authManager.login(mockLoginData(1));
      expect(loginUser.status).toBe(200);
      const cookie = loginUser.headers['set-cookie'][0];
      expect(cookie).toBeDefined();
      refreshToken = cookie.split(';')[0].split('=')[1];
      expect(refreshToken).toBeDefined();
      expect(loginUser.body).toHaveProperty('accessToken');
      expect(loginUser.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
        }),
      );
    });

    it('/auth/refresh (POST)', async () => {
      const validateRefreshToken = await tokensService.validateRefreshToken(refreshToken)
      const refresh = await authManager.refresh(refreshToken)
      expect(refresh.status).toBe(200);
      expect(refresh.body).toHaveProperty('accessToken');
      expect(refresh.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
        }),
      );
    });

    //   it('/sa/users (GET)', async () => {
    //     for (let i = 2; i < 12; i++) {
    //       let emailConfirmation = usersService.createEmailConfirmation(true);
    //       let res = await usersManager.createUser(createMockUser(i), emailConfirmation);
    //     }
    //     const users = await usersManager.getUsersWithSA();
    //     expect(users.status).toBe(200);
    //     expect(Array.isArray(users.body.items)).toBe(true);
    //     expect(users.body.items.length).toBeGreaterThan(0);
    //     users.body.items.forEach((user: any) => {
    //       expect(user).toHaveProperty('id');
    //       expect(user).toHaveProperty('login');
    //       expect(user).toHaveProperty('email');
    //       expect(user).toHaveProperty('createdAt');
    //     });
    //     users.body.items.forEach((user: any) => {
    //       expect(user.createdAt).toBeDefined();
    //       expect(new Date(user.createdAt).toISOString()).toContain('T');
    //     });
    //     expect(users.body.items[0]).toEqual(
    //       expect.objectContaining({
    //         id: expect.any(String),
    //         login: expect.any(String),
    //         email: expect.any(String),
    //         createdAt: expect.any(String),
    //       }),
    //     );
    //     if (users.body.items.length === 0) {
    //       expect(users.body.items).toEqual([]);
    //     } else {
    //       const dates = users.body.items.map((user: any) => new Date(user.createdAt));
    //       expect(dates).toEqual([...dates].sort((a, b) => b.getTime() - a.getTime()));
    //     }
    //   });
    //
    //   it('/sa/users/:id (DELETE)', async () => {
    //     const emailConfirmation = usersService.createEmailConfirmation(true);
    //     const user = await usersManager.createUser(createMockUser(13), emailConfirmation);
    //     const response = await usersManager.deleteUser(user.body.id);
    //     const users = await usersManager.getUsersWithSA();
    //     expect(response.status).toBe(204);
    //     expect(users.body.items.length).toBeLessThan(1);
    //   });
    // });
    //
    // describe('BadRequest (e2e)', () => {
    //   it('should return 400 if required field is missing on create user', async () => {
    //     const invalidPayload = {
    //       login: '',
    //       email: 'InvalidUrl',
    //       password: 'Valid Password',
    //     };
    //     const emailConfirmationInfo = usersService.createEmailConfirmation(true);
    //
    //     const response = await usersManager.createUser(invalidPayload, emailConfirmationInfo);
    //     expect(response.status).toBe(400);
    //     expect(response.body).toHaveProperty('errorsMessages');
    //     // toHaveLength, expect.any(Array)
    //     expect(Array.isArray(response.body.errorsMessages)).toBe(true);
    //     response.body.errorsMessages.forEach((error) => {
    //       expect(error).toEqual(
    //         expect.objectContaining({
    //           message: expect.any(String),
    //         }),
    //       );
    //     });
    //     response.body.errorsMessages.forEach((error: any) => {
    //       expect(['login', 'email']).toContain(error.field);
    //     });
    //   });
    // });
    //
    // describe('NotFound (e2e)', () => {
    //   it('should return 404 if id field from URL not found on delete user', async () => {
    //     const confirmationInfo = usersService.createEmailConfirmation(true);
    //     const user = await usersManager.createUser(createMockUser(14), confirmationInfo);
    //     const deleteUser = await usersManager.deleteUser(user.body.id);
    //     const response = await usersManager.deleteUser(user.body.id);
    //     expect(response.status).toBe(404);
    //     expect(response.body).toHaveProperty('statusCode', 404);
    //     expect(response.body).toHaveProperty('message');
    //   });
    //
    // });
    //
    // describe('AuthGuard (e2e)', () => {
    //   // blog must not create
    //   it('should return 401 when no token is provided', async () => {
    //     const confirmationInfo = usersService.createEmailConfirmation(true);
    //     const response = await usersManager.createUserWOAuth(createMockUser(15), confirmationInfo);
    //     expect(response.status).toBe(401);
    //     expect(response.body).toHaveProperty('message');
    //     expect(typeof response.body.message).toBe('string');
    //   });
    // });

  });

});
