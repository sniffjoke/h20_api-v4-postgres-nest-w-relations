import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { BlogCreateModel } from '../../../blogs/api/models/input/create-blog.input.model';

export class UpdateBlogCommand {
  constructor(
    public id: string,
    public dto: BlogCreateModel
  ) {
  }

}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase
  implements ICommandHandler<UpdateBlogCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository
  ) {
  }

  async execute(command: UpdateBlogCommand) {
    const blog = await this.blogsRepository.findBlogById(command.id)
    const updateBlog = await this.blogsRepository.updateBlogById(blog.id, command.dto)
    return updateBlog
  }
}
