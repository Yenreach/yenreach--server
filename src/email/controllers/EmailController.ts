import { NextFunction, Request, Response } from 'express';
import { getFileLink, sendResponse } from '../../lib/utils';
import { HttpCodes } from '../../lib/constants';
import { logger } from '../../lib/utils';
import { EmailProvider } from '../../email/providers';
import { HttpException } from '../../lib/exceptions';
import { IEmail } from '../interfaces/EmailInterface';

class EmailController {
  public testMailer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mail = await new EmailProvider().sendMail({
        to: 'oebiyeladouemmanuel@gmail.com, oracleebi247@gmail.com, codesoracle247@gmail.com, ebiyeladou@gmail.com',
        subject: `Yeanrach - KYC Request Succeeded`,
        payload: {
          heading: 'Welcome to Yenreach',
          name: 'Odisi',
          message: '<p>hello</p>',
        },
        template: '../templates/email.handlebars',
      });
      return sendResponse(res, HttpCodes.OK, 'Message sent successfully', mail);
      // return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
    } catch (error) {
      next(error);
    }
  };

  public sendMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { to, subject, heading, name, message } = req.body;

      console.log({ dat: req.body });
      await new EmailProvider().sendMail({
        to: to,
        subject: `Yenreach - ${subject}`,
        payload: {
          heading,
          name,
          message,
        },
        template: '../templates/email.handlebars',
      });
      return sendResponse(res, HttpCodes.OK, 'Message sent successfully');
      // return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
    } catch (error) {
      next(error);
    }
  };

  public sendMailSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mail = await new EmailProvider().scheduledEmail(req.body as IEmail[]);
      return sendResponse(res, HttpCodes.OK, 'Message sent successfully', mail);
    } catch (error) {
      next(error);
    }
  };

  public sendBulkMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mail = await new EmailProvider().sendBulkMail(req.body as IEmail[]);
      return sendResponse(res, HttpCodes.OK, 'Messages sent successfully', mail);
    } catch (error) {
      next(error);
    }
  };
}

export { EmailController };
