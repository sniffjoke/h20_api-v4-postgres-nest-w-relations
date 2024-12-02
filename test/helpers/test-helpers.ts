import { INestApplication } from '@nestjs/common';
import { BlogCreateModel } from '../../src/features/blogs/api/models/input/create-blog.input.model';
import request from 'supertest';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../src/core/settings/env/configuration';

// ------------------------------------------------------------------------ //

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

  async createBlog(createModel: BlogCreateModel) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .post('/sa/blogs')
      .send(createModel)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) })
    return response
  }

  async updateBlog(updModel: BlogCreateModel, blogId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .put('/sa/blogs/' + `${blogId}`)
      .send(updModel)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) })
    return response
  }

  async getBlogs() {
    const response = await request(this.app.getHttpServer())
      .get('/blogs/')
    return response
  }

  async getBlogsWithSA() {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .get('/sa/blogs/')
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) })
    return response
  }

  async getBlogById(blogId: string) {
    const response = await request(this.app.getHttpServer())
      .get('/blogs/' + `${blogId}`)
    return response
  }

  async deleteBlog(blogId: string) {
    const apiSettings = this.configService.get('apiSettings', { infer: true });
    const response = await request(this.app.getHttpServer())
      .delete('/sa/blogs/' + `${blogId}`)
      .set({ 'Authorization': `Basic ` + codeAuth(apiSettings.ADMIN) })
      .expect(204);
    return response
  }

}

// ------------------------------------------------------------------------ //
// ----------------------------OBJECTS-------------------------------------- //
// ------------------------------------------------------------------------ //


export const mockBlog = (n: number) => ({
  name: 'name' + `${n}`,
  description: 'description' + `${n}`,
  websiteUrl: 'http://some-' + `${n}` + '-url.com',
});

// ------------------------------------------------------------------------ //



















































































































// export const mockPost = (n: number, blogId: string) => ({
//   title: 'title' + `${n}`,
//   shortDescription: 'shortDescription' + `${n}`,
//   content: 'content' + `${n}`,
//   blogId,
// });

// ------------------------------------------------------------------------ //

// export const mockUser = (n: number): UserDBType => ({
//     login: 'login-' + `${n}`,
//     email: 'email' + `${n}` + '@mail.ru',
//     password: 'qwerty1'
// })
//
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
//
//
// export const testCreateBlogAndPost = async (n: number, request, app, apiSetting) => {
//   const resCreateBlog = await request(app.getHttpServer())
//     .post('/sa/blogs')
//     .send(mockBlog(n))
//     .set({ 'Authorization': `Basic ` + codeAuth(apiSetting.ADMIN) })
//     .expect(201);
//   const newPost: PostCreateModel = mockPost(n, resCreateBlog.body.id);
//   const resCreatePost = await request(app.getHttpServer())
//     .post('/sa/posts')
//     .set({ 'Authorization': `Basic ` + codeAuth(apiSetting.ADMIN) })
//     .send(newPost)
//     .expect(201);
//   return {
//     newBlog: resCreateBlog,
//     postData: newPost,
//     newPost: resCreatePost,
//   };
// };
//
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


