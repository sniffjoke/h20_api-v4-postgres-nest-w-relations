import { BadRequestException } from '@nestjs/common';
import { EmailConfirmationModel } from '../../api/models/input/create-user.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UsersService } from '../users.service';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../../../core/settings/env/configuration';


export class ResendEmailCommand {
  constructor(
    public email: string,
  ) {
  }

}

@CommandHandler(ResendEmailCommand)
export class ResendEmailUseCase
  implements ICommandHandler<ResendEmailCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private configService: ConfigService<ConfigurationType, true>
  ) {

  }

  async execute(command: ResendEmailCommand) {
    const apiSettings = this.configService.get('apiSettings', {
      infer: true,
    });
    const isUserExists = await this.usersRepository.findUserByEmail(command.email);
    if (isUserExists.isConfirm) {
      throw new BadRequestException('Email already activate')
    }
    const emailConfirmation: EmailConfirmationModel = this.usersService.createEmailConfirmation(false);
    await this.usersService.sendActivationEmail(command.email, `${apiSettings.API_URL}/?code=${emailConfirmation.confirmationCode as string}`);
    const updateUserInfo = await this.usersRepository.updateUserByResendEmail(
      isUserExists.id,
      emailConfirmation
    );
    return updateUserInfo;
  }
}
