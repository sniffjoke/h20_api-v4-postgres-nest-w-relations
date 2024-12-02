import { INestApplication } from '@nestjs/common';
import { BlogsTestManager, mockBlog } from '../helpers/test-helpers';
import { initSettings } from '../helpers/init-settings';
import { deleteAllData } from '../helpers/delete-all-data';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let blogManager: BlogsTestManager;


  beforeAll(async () => {
    const result = await initSettings();
    app = result.app;
    blogManager = result.blogTestManger;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await deleteAllData(app);
  });


  it('/sa/blogs (POST)', async () => {
    const newBlog = mockBlog(1);
    const blog = await blogManager.createBlog(newBlog);
    expect(blog.status).toBe(201);
    expect(blog.body).toHaveProperty('id');
    expect(blog.body).toHaveProperty('name');
    expect(blog.body).toHaveProperty('description');
    expect(blog.body).toHaveProperty('websiteUrl');
    expect(blog.body).toHaveProperty('createdAt');
    expect(blog.body).toHaveProperty('isMembership');
    expect(new Date(blog.body.createdAt).toISOString()).toContain('T');
    expect(blog.body.createdAt).toBeDefined();
    expect(blog.body.isMembership).toBeDefined();
    expect(typeof blog.body.id).toBe('string');
    expect(typeof blog.body.name).toBe('string');
    expect(typeof blog.body.description).toBe('string');
    expect(typeof blog.body.websiteUrl).toBe('string');
    expect(typeof blog.body.createdAt).toBe('string');
    expect(typeof blog.body.isMembership).toBe('boolean');
    expect(blog.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.stringMatching(/^https?:\/\/[^\s$.?#].[^\s]*$/),
        createdAt: expect.any(String),
        isMembership: expect.any(Boolean),
      }),
    );
  });

  it('/sa/blogs/:id (UPDATE)', async () => {
    const newBlog = mockBlog(2);
    const res = await blogManager.createBlog(newBlog);
    const updateData = mockBlog(3);
    const upd = await blogManager.updateBlog(updateData, res.body.id);
    const updatedBlog = await blogManager.getBlogById(res.body.id);
    expect(upd.status).toBe(204);
    expect(updatedBlog.body.id).toEqual(res.body.id);
    expect(updatedBlog.body.name).not.toEqual(res.body.name);
    expect(updatedBlog.body.description).not.toEqual(res.body.description);
    expect(updatedBlog.body.websiteUrl).not.toEqual(res.body.websiteUrl);
  });

  it('/sa/blogs/:id (DELETE)', async () => {
    const newBlog = mockBlog(4);
    const res = await blogManager.createBlog(newBlog);
    const response = await blogManager.deleteBlog(res.body.id);
    const blogs = await blogManager.getBlogsWithSA();
    expect(response.status).toBe(204);
    expect(blogs.body.items.length).toBeLessThan(1);
  });

  it('/blogs (GET)', async () => {
    for (let i = 5; i < 15; i++) {
      let newBlog = mockBlog(i);
      let res = await blogManager.createBlog(newBlog);
    }
    const blogs = await blogManager.getBlogs();
    expect(blogs.status).toBe(200);
    expect(Array.isArray(blogs.body.items)).toBe(true);
    expect(blogs.body.items.length).toBeGreaterThan(0);
    blogs.body.items.forEach((blog: any) => {
      expect(blog).toHaveProperty('id');
      expect(blog).toHaveProperty('name');
      expect(blog).toHaveProperty('description');
      expect(blog).toHaveProperty('websiteUrl');
      expect(blog).toHaveProperty('createdAt');
      expect(blog).toHaveProperty('isMembership');
    });
    blogs.body.items.forEach((blog: any) => {
      expect(typeof blog.id).toBe('string');
      expect(typeof blog.name).toBe('string');
      expect(typeof blog.description).toBe('string');
      expect(typeof blog.websiteUrl).toBe('string');
      expect(typeof blog.createdAt).toBe('string');
      expect(typeof blog.isMembership).toBe('boolean');
    });
    blogs.body.items.forEach((blog: any) => {
      expect(blog.createdAt).toBeDefined();
      expect(blog.isMembership).toBeDefined();
      expect(new Date(blog.createdAt).toISOString()).toContain('T');
    });
    expect(blogs.body.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.stringMatching(/^https?:\/\/[^\s$.?#].[^\s]*$/),
        createdAt: expect.any(String),
        isMembership: expect.any(Boolean),
      }),
    );
    if (blogs.body.items.length === 0) {
      expect(blogs.body.items).toEqual([]);
    }
  });

  it('/sa/blogs (GET)', async () => {
    for (let i = 16; i < 26; i++) {
      let newBlog = mockBlog(i);
      let res = await blogManager.createBlog(newBlog);
    }
    const blogs = await blogManager.getBlogsWithSA();
    expect(blogs.status).toBe(200);
    expect(Array.isArray(blogs.body.items)).toBe(true);
    expect(blogs.body.items.length).toBeGreaterThan(0);
    blogs.body.items.forEach((blog: any) => {
      expect(blog).toHaveProperty('id');
      expect(blog).toHaveProperty('name');
      expect(blog).toHaveProperty('description');
      expect(blog).toHaveProperty('websiteUrl');
      expect(blog).toHaveProperty('createdAt');
      expect(blog).toHaveProperty('isMembership');
    });
    blogs.body.items.forEach((blog: any) => {
      expect(typeof blog.id).toBe('string');
      expect(typeof blog.name).toBe('string');
      expect(typeof blog.description).toBe('string');
      expect(typeof blog.websiteUrl).toBe('string');
      expect(typeof blog.createdAt).toBe('string');
      expect(typeof blog.isMembership).toBe('boolean');
    });
    blogs.body.items.forEach((blog: any) => {
      expect(blog.createdAt).toBeDefined();
      expect(blog.isMembership).toBeDefined();
      expect(new Date(blog.createdAt).toISOString()).toContain('T');
    });
    expect(blogs.body.items[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.stringMatching(/^https?:\/\/[^\s$.?#].[^\s]*$/),
        createdAt: expect.any(String),
        isMembership: expect.any(Boolean),
      }),
    );
    if (blogs.body.items.length === 0) {
      expect(blogs.body.items).toEqual([]);
    } else {
      const dates = blogs.body.items.map((blog: any) => new Date(blog.createdAt));
      expect(dates).toEqual([...dates].sort((a, b) => b.getTime() - a.getTime()));
    }
  });

  it('/blogs/:id (GET)', async () => {
    const newBlog = mockBlog(27);
    const res = await blogManager.createBlog(newBlog);
    const blog = await blogManager.getBlogById(res.body.id);
    expect(blog.status).toBe(200);
    expect(blog.body).toHaveProperty('id');
    expect(blog.body).toHaveProperty('name');
    expect(blog.body).toHaveProperty('description');
    expect(blog.body).toHaveProperty('websiteUrl');
    expect(blog.body).toHaveProperty('createdAt');
    expect(blog.body).toHaveProperty('isMembership');
    expect(new Date(blog.body.createdAt).toISOString()).toContain('T');
    expect(blog.body.createdAt).toBeDefined();
    expect(blog.body.isMembership).toBeDefined();
    expect(typeof blog.body.id).toBe('string');
    expect(typeof blog.body.name).toBe('string');
    expect(typeof blog.body.description).toBe('string');
    expect(typeof blog.body.websiteUrl).toBe('string');
    expect(typeof blog.body.createdAt).toBe('string');
    expect(typeof blog.body.isMembership).toBe('boolean');
    expect(blog.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.stringMatching(/^https?:\/\/[^\s$.?#].[^\s]*$/),
        createdAt: expect.any(String),
        isMembership: expect.any(Boolean),
      }),
    );
  });

  it('should return 400 if required field is missing on create blog', async () => {
    const invalidPayload = {
      name: '',
      description: 'Invalid',
      websiteUrl: 'InvalidUrl',
    };

    const response = await blogManager.createBlog(invalidPayload);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errorsMessages');
    expect(Array.isArray(response.body.errorsMessages)).toBe(true);
    response.body.errorsMessages.forEach((error) => {
      expect(error).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
    });
    response.body.errorsMessages.forEach((error: any) => {
      // expect(['name', 'websiteUrl']).toContain(error.field);
      expect(error.field === 'name' || error.field === 'websiteUrl').toBeTruthy();
    });
  });

  it('should return 400 if required field is missing on update blog', async () => {
    const newBlog = mockBlog(28);
    const res = await blogManager.createBlog(newBlog);
    const invalidPayload = {
      name: '',
      description: 'Invalid',
      websiteUrl: 'InvalidUrl',
    };
    const response = await blogManager.updateBlog(invalidPayload, res.body.id);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errorsMessages');
    expect(Array.isArray(response.body.errorsMessages)).toBe(true);
    response.body.errorsMessages.forEach((error) => {
      expect(error).toEqual(
        expect.objectContaining({
          message: expect.any(String),
        }),
      );
    });
    response.body.errorsMessages.forEach((error: any) => {
      expect(['name', 'websiteUrl']).toContain(error.field);
      // expect(error.field === 'name' || error.field === 'websiteUrl').toBeTruthy();
    });
  });

  it('should return 404 if id field from URL not found on delete blog', async () => {
    const newBlog = mockBlog(29);
    const res = await blogManager.createBlog(newBlog);
    const response = await blogManager.deleteBlog(res.body.id);
    const findedBlog = await blogManager.getBlogById(res.body.id);
    expect(findedBlog.status).toBe(404);
    expect(findedBlog.body).toHaveProperty('statusCode', 404);
    expect(findedBlog.body).toHaveProperty('message');
  });

});
