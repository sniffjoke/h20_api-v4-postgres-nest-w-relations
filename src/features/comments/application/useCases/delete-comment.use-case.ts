import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensService } from '../../../tokens/application/tokens.service';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { UsersCheckHandler } from '../../../users/domain/users.check-handler';

export class DeleteCommentCommand {
  constructor(
    public id: string,
    public bearerHeader: string
  ) {
  }

}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    private readonly tokensService: TokensService,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersCheckHandler: UsersCheckHandler
  ) {
  }

  async execute(command: DeleteCommentCommand) {
    const token = this.tokensService.getToken(command.bearerHeader);
    const decodedToken = this.tokensService.decodeToken(token);
    const findedComment = await this.commentsRepository.findCommentById(command.id);
    const isOwner = this.usersCheckHandler.checkIsOwner(findedComment.userId, decodedToken._id);
    if (isOwner) {
      const deleteComment = await this.commentsRepository.deleteComment(command.id);
      return deleteComment;
    }
  }
}
