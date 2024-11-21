import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { TokensService } from '../../../tokens/application/tokens.service';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentCreateModel } from '../../api/models/input/create-comment.input.model';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';

export class CreateCommentCommand {
  constructor(
    public commentDto: CommentCreateModel,
    public postId: string,
    public bearerHeader: string
  ) {
  }

}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly tokensService: TokensService,
    private readonly usersRepository: UsersRepository,
    private readonly commentsRepository: CommentsRepository
  ) {
  }

  async execute(command: CreateCommentCommand) {
    const token = this.tokensService.getToken(command.bearerHeader);
    const decodedToken = this.tokensService.decodeToken(token);
    const user = await this.usersRepository.findUserById(decodedToken._id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const findedPost = await this.postsRepository.findPostById(command.postId);
    const newCommentId = await this.commentsRepository.createComment(command.commentDto, user.id, command.postId);
    return newCommentId;
  }
}
