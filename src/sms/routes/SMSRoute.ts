import { Request, Response, NextFunction, Router } from 'express';
import { SMSController } from '../controllers';
import { Routes } from '../../core/routes/interfaces';
class SMSRoute implements Routes {
  public path = '/sms';
  public router = Router();
  public smsController = new SMSController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(`${this.path}/send-sms`, this.smsController.sendSMS);

    this.router.post(`${this.path}/send-sms-sequence`, this.smsController.sendSMSSequence);

    this.router.post(`${this.path}/send-bulk-sms`, this.smsController.sendBulkSMS);
  }
}

export { SMSRoute };
