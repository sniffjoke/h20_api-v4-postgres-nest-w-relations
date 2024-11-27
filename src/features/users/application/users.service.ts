import { Injectable } from '@nestjs/common';
import { EmailConfirmationModel } from '../api/models/input/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { UuidService } from 'nestjs-uuid';
import { add } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { ConfigurationType } from '../../../core/settings/env/configuration';

@Injectable()
export class UsersService {

  constructor(
    private readonly mailService: MailerService,
    private readonly uuidService: UuidService,
    private configService: ConfigService<ConfigurationType, true>
  ) {
  }

  // Доменное событие

  public createEmailConfirmation(isConfirm: boolean) {
    const emailConfirmationNotConfirm: EmailConfirmationModel = {
      isConfirm: false,
      confirmationCode: this.uuidService.generate(),
      expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        },
      ).toISOString(),
    };
    const emailConfirmationIsConfirm: EmailConfirmationModel = {
      isConfirm: true,
    };
    return isConfirm ? emailConfirmationIsConfirm : emailConfirmationNotConfirm;
  }

  public async sendActivationEmail(to: string, link: string) {
    const apiSettings = this.configService.get('apiSettings', {
      infer: true,
    });
    await this.mailService.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + apiSettings.API_URL,
      text: '',
      html:
             `
                 <h1>Thank for your registration</h1>
                 <p>To finish registration please follow the link below:
                     <a href='${link}'>Завершить регистрацию</a>
                 </p>
  
             `,
    });
  }

}
