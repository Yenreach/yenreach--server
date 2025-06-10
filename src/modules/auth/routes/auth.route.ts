import { Request, Response, NextFunction, Router } from 'express';
import { AuthController } from '../controllers';
import { Routes } from '../../../core/routes/interfaces';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public AuthController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.post(`${this.path}/register`, this.AuthController.register)
    this.router.post(`${this.path}/login`, this.AuthController.login)
    this.router.post(`${this.path}/admin-login`, this.AuthController.loginAdmin)
    this.router.post(`${this.path}/admin-register`, this.AuthController.registerAdmin)
  }
}

export { AuthRoute };

