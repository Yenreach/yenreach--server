import { Router } from 'express';
import { AuthController } from '../controllers';
import { AuthDto } from '../dtos';
import { Routes } from '@/core/routes/interfaces/RouteInterface';
import { authMiddleware } from '@/core/middlewares/AuthMiddleware';
import { validationMiddleware } from '@/core/middlewares/ValidationMiddleware';
import { canLoginApp } from '@/core/middlewares';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.authController.register);
    this.router.post(`${this.path}/phone/send`, this.authController.sendPhoneOtp)
    this.router.post(`${this.path}/verify`, this.authController.verify)
    this.router.post(`${this.path}/resend`, this.authController.resendOtp)
    this.router.post(`${this.path}/check`, this.authController.checkDuplicates)
    this.router.post(`${this.path}/login`, this.authController.logIn);
    this.router.post(`${this.path}/password/reset`, this.authController.requestPasswordReset);
    this.router.post(`${this.path}/password/verify`, this.authController.verifyPasswordCode);
    this.router.post(`${this.path}/password/change`, this.authController.changePassword);
    this.router.post(`${this.path}/logout`, authMiddleware, this.authController.logOut);
  }
}

export { AuthRoute };

