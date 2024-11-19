import { Module } from "@nestjs/common";
import { BlogsController } from "./api/blogs.controller";
import { BlogsRepository } from "./infrastructure/blogs.repository";
import { BlogsQueryRepository } from "./infrastructure/blogs.query-repository";
import { PostsModule } from "../posts/posts.module";
import { BlogsCommandHandlers } from './application/useCases';

@Module({
  imports: [
    PostsModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    ...BlogsCommandHandlers
  ],
  exports: [
    BlogsRepository,
    BlogsQueryRepository,
    ...BlogsCommandHandlers
  ]
})
export class BlogsModule {
}
