import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

export class DeletePostWithBlogInParamsCommand {
  constructor(
    public postId: string,
    public blogId: string
  ) {
  }

}

@CommandHandler(DeletePostWithBlogInParamsCommand)
export class DeletePostWithBlogInParamsUseCase
  implements ICommandHandler<DeletePostWithBlogInParamsCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsRepository
  ) {
  }

  async execute(command: DeletePostWithBlogInParamsCommand) {
    const findedBlog = await this.blogsRepository.findBlogById(command.blogId)
    const deletePost = await this.postsRepository.deletePostFromBlogsUri(command.postId, command.blogId)
    return deletePost
  }
}
