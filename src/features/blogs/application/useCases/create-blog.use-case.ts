import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogCreateModel } from '../../api/models/input/create-blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(
    public blogCreateModel: BlogCreateModel
  ) {
  }

}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase
  implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository
  ) {
  }

  async execute(command: CreateBlogCommand) {
    const newBlogId = await this.blogsRepository.create(command.blogCreateModel)
    return newBlogId
  }
}
