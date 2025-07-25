import sgMail from '@sendgrid/mail';
import { readFileSync } from 'fs';
import path, { join, resolve } from 'path';
import { compile } from 'handlebars';
import { SMTP_HOSTNAME, SMTP_USERNAME, SMTP_PASSWORD, APP_NAME, APP_URL, APP_LOGO, APP_EMAIL } from '../../config';
import { EmailPayload } from '../interfaces';
import { logger } from '../../core/utils';
import nodemailer from 'nodemailer';
import { IEmail } from '../interfaces/EmailInterface';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

// const users = [
//   {
//     name: 'ebi',
//     email: 'oebiyeladouemmanuel@gmail.com',
//     email_track: '1',
//   },
//   {
//     name: 'ebi',
//     email: 'oracleebi247@gmail.com',
//     email_track: '1',
//   },
//   {
//     name: 'ebi',
//     email: 'codesoracle247@gmail.com',
//     email_track: '1',
//   },
//   {
//     name: 'ebi',
//     email: 'ebiyeladou@gmail.com',
//     email_track: '1',
//   },
// ]

// const userCount = 4

class EmailProvider {
  public mailer = sgMail;
  public transporter;

  constructor() {
    logger.info('Mail provider');
  }

  private async compileHtmlEmail(template: string, payload: object) {
    try {
      const templateSource = await readFileSync(join(resolve(__dirname, template)));

      const compiledTemplate = compile(String(templateSource));

      return compiledTemplate({
        ...payload,
        app: {
          name: APP_NAME,
          url: APP_URL,
          logo: APP_LOGO,
          email: APP_EMAIL,
        },
      });
    } catch (err) {
      logger.error(err);
    }
  }

  public async sendMail({ to, subject, payload, template }: EmailPayload): Promise<any> {
    try {
      // const oauth2Client = new OAuth2(
      //   CLIENT_ID,
      //   CLIENT_SECRET,
      //   "https://developers.google.com/oauthplayground"
      // );

      // oauth2Client.setCredentials({
      //   refresh_token: REFRESH_TOKEN,
      // });

      // const accessToken = await new Promise((resolve, reject) => {
      //   oauth2Client.getAccessToken((err, token) => {
      //     if (err) {
      //       console.log("*ERR: ", err)
      //       reject();
      //     }
      //     resolve(token);
      //   });
      // });

      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     type: "OAuth2",
      //     user: USER_EMAIL,
      //     accessToken,
      //     clientId: CLIENT_ID,
      //     clientSecret: CLIENT_SECRET,
      //     refreshToken: REFRESH_TOKEN,
      //   },
      // });

      const transporter = nodemailer.createTransport({
        host: SMTP_HOSTNAME!,
        port: 465,
        secure: true,
        auth: {
          user: SMTP_USERNAME!,
          pass: SMTP_PASSWORD!,
        },
        pool: true,
        maxMessages: 1000000,
        maxConnections: 20,
      } as SMTPTransport.Options);

      const html: string = await this.compileHtmlEmail(template, payload);

      const mailOptions = {
        from: SMTP_USERNAME,
        to: to,
        subject: subject,
        html: html,
      };

      const info = await transporter.sendMail(mailOptions);

      if (!info) throw new Error('Unable to send mail');

      console.log('Email sent:', info);
      return info; // ✅ fixed: changed method return type to Promise<any>
    } catch (error) {
      console.log({ error });
      logger.error(error);
    }
  }

  public async scheduledEmail(data: IEmail[]): Promise<void> {
    try {
      await Promise.all(
        data.map((mail: IEmail) =>
          this.sendMail({
            to: mail.to,
            subject: `Yenreach - ${mail.subject}`,
            payload: {
              heading: mail.heading,
              name: mail.name,
              message: mail.message,
            },
            template: '../templates/email.handlebars',
          }),
        ),
      );
    } catch (error) {
      console.log({ error });
      logger.error(error);
    }
  }

  public async sendBulkMail(data: IEmail[]): Promise<any> {
    try {
      await Promise.all(
        data.map((mail: IEmail) =>
          this.sendMail({
            to: mail.to,
            subject: `Yenreach - ${mail.subject}`,
            payload: {
              heading: mail.heading,
              name: mail.name,
              message: mail.message,
            },
            template: '../templates/email.handlebars',
          }),
        ),
      );

      return {
        message: 'Messages Send Successfully',
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch Activity');
    }
  }
}

export { EmailProvider };
