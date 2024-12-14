import { INestApplication } from '@nestjs/common';
import { BlogCreateModel } from '../../src/features/blogs/api/models/input/create-blog.input.model';
import request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../src/core/settings/env/configuration';
import {
  PostCreateModelWithParams,
} from '../../src/features/posts/api/models/input/create-post.input.model';
import { CreateUserDto, EmailConfirmationModel } from '../../src/features/users/api/models/input/create-user.dto';
import { UsersService } from '../../src/features/users/application/users.service';

// ------------------------------------------------------------------------ //

export const checkWebsiteString: RegExp = /^https?:\/\/[^\s$.?#].[^\s]*$/;

export const codeAuth = (code: string) => {
  const buff2 = Buffer.from(code, 'utf8');
  const codedAuth = buff2.toString('base64');
  return codedAuth;
};

// ------------------------------------------------------------------------ //

export class BlogsTestManager {
  constructor(
    protected readonly app: INestApplication,
    private configService: ConfigService<ConfigurationType, true>,
  ) {
  }

  async createBlog(createModel: BlogCreateModel, token?) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .post('/sa/blogs')
      .send(createModel)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) });
    return response;
  }

  async createBlogWOAuth(createModel: BlogCreateModel) {
    const response = await request(this.app.getHttpServer())
      .post('/sa/blogs')
      .send(createModel);
    return response;
  }

  async updateBlog(updModel: BlogCreateModel, blogId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .put('/sa/blogs/' + `${blogId}`)
      .send(updModel)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) });
    return response;
  }

  async getBlogs() {
    const response = await request(this.app.getHttpServer())
      .get('/blogs/');
    return response;
  }

  async getBlogsWithSA() {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .get('/sa/blogs/')
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) });
    return response;
  }

  async getBlogById(blogId: string) {
    const response = await request(this.app.getHttpServer())
      .get('/blogs/' + `${blogId}`);
    return response;
  }

  async deleteBlog(blogId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .delete('/sa/blogs/' + `${blogId}`)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) })
      .expect(204);
    return response;
  }

}

// ------------------------------------------------------------------------ //
// ----------------------------OBJECTS-------------------------------------- //
// ------------------------------------------------------------------------ //

export const createMockBlog = (uniqueIndex: number) => ({
  name: 'name' + `${uniqueIndex}`,
  description: 'description' + `${uniqueIndex}`,
  websiteUrl: 'http://some-' + `${uniqueIndex}` + '-url.com',
});

// ------------------------------------------------------------------------ //

export class PostsTestManager {
  constructor(
    protected readonly app: INestApplication,
    private configService: ConfigService<ConfigurationType, true>,
  ) {
  }

  async createPost(createModel: PostCreateModelWithParams, blogId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .post(`/sa/blogs/${blogId}/posts`)
      .send(createModel)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) });
    return response;
  }

  async getPostsWithSA(blogId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .get(`/sa/blogs/${blogId}/posts`)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) });
    return response;
  }

  async updatePost(updModel: PostCreateModelWithParams, blogId: string, postId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .put('/sa/blogs/' + `${blogId}` + '/posts/' + `${postId}`)
      .send(updModel)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) })
    return response
  }

  async getPostById(postId: string) {
    const response = await request(this.app.getHttpServer())
      .get('/posts/' + `${postId}`)
    return response
  }

  async deletePost(postId: string, blogId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .delete('/sa/blogs/' + `${blogId}` + '/posts/' + `${postId}`)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) })
    return response
  }

  async getPosts() {
    const response = await request(this.app.getHttpServer())
      .get('/posts')
    return response
  }

  async createPostWOAuth(createModel: PostCreateModelWithParams, blogId: string) {
    const response = await request(this.app.getHttpServer())
      .post('/sa/blogs/' + `${blogId}` + '/posts')
      .send(createModel)
    return response
  }

}

export const createMockPost = (uniqueIndex: number) => ({
  title: 'title' + `${uniqueIndex}`,
  shortDescription: 'shortDescription' + `${uniqueIndex}`,
  content: 'content' + `${uniqueIndex}`,
});


// ------------------------------------------------------------------------ //

export class UsersTestManager {
  constructor(
    protected readonly app: INestApplication,
    private configService: ConfigService<ConfigurationType, true>,
  ) {
  }

  async createUser(createModel: CreateUserDto, emailConfirmation: EmailConfirmationModel) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .post('/sa/users')
      .send({ ...createModel, emailConfirmation })
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) });
    return response;
  }

  async createUserWOAuth(createModel: CreateUserDto, emailConfirmation: EmailConfirmationModel) {
    const response = await request(this.app.getHttpServer())
      .post('/sa/users')
      .send({ ...createModel, emailConfirmation })
    return response;
  }

  async getUsersWithSA() {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .get('/sa/users')
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) });
    return response;
  }

  async deleteUser(userId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .delete('/sa/users/' + `${userId}`)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) })
    return response
  }

  // async getPosts() {
  //   const response = await request(this.app.getHttpServer())
  //     .get('/posts')
  //   return response
  // }
  //
  // async createPostWOAuth(createModel: PostCreateModelWithParams, blogId: string) {
  //   const response = await request(this.app.getHttpServer())
  //     .post('/sa/blogs/' + `${blogId}` + '/posts')
  //     .send(createModel)
  //   return response
  // }

}


// ------------------------------------------------------------------------ //

export const createMockUser = (uniqueIndex: number) => ({
    login: 'login-' + `${uniqueIndex}`,
    email: 'email' + `${uniqueIndex}` + '@mail.ru',
    password: 'qwerty1'
})

// // ------------------------------------------------------------------------ //
//
// export const mockLoginData = (n: number): LoginUserDto => ({
//     loginOrEmail: 'login-' + `${n}`,
//     password: 'qwerty1'
// })
//
// // ------------------------------------------------------------------------ //
//
// export const mockComment = (n: number, newUser: any, postId: string): CommentDBType => ({
//     content: 'commentContent20 + ' + `${n}`,
//     commentatorInfo: {
//         userId: newUser.body.id,
//         userLogin: newUser.body.login
//     },
//     postId
// })
//
// // ------------------------------------------------------------------------ //
// // -------------------------CREATORS--------------------------------------- //
// // ------------------------------------------------------------------------ //

// // ------------------------------------------------------------------------ //
//
// export const testCreateUser = async (n: number) => {
//     const userData: UserDBType = mockUser(n)
//
//     const newUser = await req
//         .post(SETTINGS.PATH.USERS)
//         .set({'Authorization': `Basic ` + codeAuth(SETTINGS.VARIABLES.ADMIN)})
//         .send(userData)
//         .expect(201)
//
//     return {
//         newUser,
//         userData
//     }
// }
//
// // ------------------------------------------------------------------------ //
//
// export const testCreateComment = async (n: number, newUser: any, postId: string, token: string) => {
//     const commentData = mockComment(n, newUser, postId)
//     const newComment = await req
//         .post(`${SETTINGS.PATH.POSTS}` + '/' + `${postId}` + '/' + 'comments')
//         .auth(token, {type: 'bearer'})
//         .send(commentData)
//         .expect(201)
//     return {
//         commentData,
//         newComment
//     }
// }
//
// // ------------------------------------------------------------------------ //
//
// export const login = async (loginOrEmail: string, password: string) => {
//     const loginData = await req
//         .post(SETTINGS.PATH.AUTH + '/login')
//         .send({loginOrEmail, password})
//         .expect(200)
//     return {
//         loginData
//     }
// }
//


