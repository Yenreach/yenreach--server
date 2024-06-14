import sgMail from '@sendgrid/mail'
import { readFileSync } from 'fs'
import path, { join, resolve } from 'path'
import { compile } from 'handlebars'
import { USER_EMAIL, USER_PASS, SMTP_HOSTNAME, SMTP_USERNAME, SMTP_PASSWORD, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, ACCESS_TOKEN, APP_NAME, APP_URL, APP_LOGO, APP_EMAIL } from '@/config'
import { EmailPayload } from '../interfaces'
import { logger } from '@/core/utils'
import nodemailer from 'nodemailer'
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

class EmailProvider {
  public mailer = sgMail
  public transporter;

  constructor() {
    logger.info("Mail provider")
  }



  private async compileHtmlEmail(template: string, payload: object) {
    try {
      const templateSource = await readFileSync(join(resolve(__dirname, template)))

      const compiledTemplate = compile(String(templateSource))

      return compiledTemplate({
        ...payload, app: {
          name: APP_NAME, url: APP_URL, logo: APP_LOGO, email: APP_EMAIL
        }
      })
    } catch (err) {
      logger.error(err)
    }
  }

  public async sendMail({ to, subject, payload, template }: EmailPayload): Promise<void> {
    try {

      const oauth2Client = new OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );

      oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
      });

      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
          if (err) {
            console.log("*ERR: ", err)
            reject();
          }
          resolve(token);
        });
      });

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
        host: SMTP_HOSTNAME,
        port: 465,
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD
        },
        debugger: true,
        logger: true,
        pool: true,
        maxMessages: 1000000,
        maxConnections: 20,

      });



      const html: string = await this.compileHtmlEmail(template, payload)

      // console.log(html)

      const mailOptions = {
        from: SMTP_USERNAME,
        to: to,
        subject: subject,
        html: html
      };

      // console.log({ payload, to, subject, template })
      const info = await transporter.sendMail(mailOptions);

      if (!info) throw new Error("Unable to send mail");

      console.log('Email sent:', info);
      return info;
    } catch (error) {
      console.log({ error })
      logger.error(error)
    }
  }
}

export { EmailProvider }
