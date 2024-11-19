import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogCreateModel } from '../../api/models/input/create-blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

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
