import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostCreateModel } from '../../api/models/input/create-post.input.model';

export class CreatePostCommand {
  constructor(
    public postCreateModel: PostCreateModel
  ) {
  }

}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository
  ) {
  }

  async execute(command: CreatePostCommand) {
    const findedBlog = await this.blogsRepository.findBlogById(command.postCreateModel.blogId);
    const newPostId = await this.postsRepository.createPost(command.postCreateModel, findedBlog.name);
    return newPostId;
  }
}
