import { Request, Response, NextFunction, Router } from 'express';
import { UserController } from '../controllers';
import { Routes } from '../../core/routes/interfaces';



class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.route(`${this.path}`).post(this.userController.createUser)
  }
}

export { UserRoute };

