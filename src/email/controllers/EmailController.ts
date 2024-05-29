import { NextFunction, Request, Response } from 'express';
import { getFileLink, sendResponse } from '@/core/utils';
import { HttpCodes } from '@/core/constants';
import { logger } from '@/core/utils';
import { EmailProvider } from '@/email/providers';
import { HttpException } from '@/core/exceptions';

class EmailController {


  public testMailer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mail = await (new EmailProvider).sendMail({
        to: 'oebiyeladouemmanuel@gmail.com',
        subject: `Yeanrach - KYC Request Succeeded`,
        payload: {
          heading: 'Welcome to Yenreach',
          name: 'Odisi',
          message: "<p>hello</p>"
        },
        template: '../templates/email.handlebars'
      })
      return sendResponse(res, HttpCodes.OK, 'Message sent successfully', mail)
      // return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
    } catch (error) {
      next(logger.error(error));
    }
  }

  public sendMail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { to, subject, heading, name, message } = req.body;

      const mail = await (new EmailProvider).sendMail({
        to: to,
        subject: `Yenreach - ${subject}`,
        payload: {
          heading,
          name,
          message
        },
        template: '../templates/email.handlebars'
      })
      return sendResponse(res, HttpCodes.OK, 'Message sent successfully', mail)
      // return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
    } catch (error) {
      next(logger.error(error));
    }
  }
}

export { EmailController };
