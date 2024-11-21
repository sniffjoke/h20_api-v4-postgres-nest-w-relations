import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensService } from '../../../tokens/application/tokens.service';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentCreateModel } from '../../api/models/input/create-comment.input.model';
import { UsersCheckHandler } from '../../../users/domain/users.check-handler';

export class UpdateCommentCommand {
  constructor(
    public commentDto: CommentCreateModel,
    public id: string,
    public bearerHeader: string
  ) {
  }

}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand> {
  constructor(
    private readonly tokensService: TokensService,
    private readonly commentsRepository: CommentsRepository,
    private readonly usersCheckHandler: UsersCheckHandler
  ) {
  }

  async execute(command: UpdateCommentCommand) {
    const token = this.tokensService.getToken(command.bearerHeader);
    const decodedToken = this.tokensService.decodeToken(token);
    const findedComment = await this.commentsRepository.findCommentById(command.id);
    const isOwner = this.usersCheckHandler.checkIsOwner(findedComment.userId, decodedToken._id);
    if (isOwner) {
      const updateComment = await this.commentsRepository.updateComment(command.id, command.commentDto);
      return updateComment;
    }
  }
}
