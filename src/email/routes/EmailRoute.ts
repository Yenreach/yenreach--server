import { Request, Response, NextFunction, Router } from 'express';
import { EmailController } from '../controllers';
import { Routes } from '@/core/routes/interfaces';
import { authMiddleware, checkOwnership } from '@/core/middlewares';


class EmailRoute implements Routes {
  public path = '/email';
  public router = Router();
  public emailController = new EmailController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.post(`${this.path}/test-mail`, this.emailController.testMailer)

    this.router.post(`${this.path}/test-mail`, this.emailController.sendMail)


  }
}

export { EmailRoute };

