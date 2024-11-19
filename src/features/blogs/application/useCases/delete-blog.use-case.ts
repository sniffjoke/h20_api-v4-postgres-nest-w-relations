import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class DeleteBlogCommand {
  constructor(
    public id: string
  ) {
  }

}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase
  implements ICommandHandler<DeleteBlogCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository
  ) {
  }

  async execute(command: DeleteBlogCommand) {
    const findedBlog = await this.blogsRepository.findBlogById(command.id)
    const deleteBlog = await this.blogsRepository.deleteBlog(command.id)
    return deleteBlog
  }
}
