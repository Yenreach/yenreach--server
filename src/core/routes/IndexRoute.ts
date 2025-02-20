import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../core/routes/interfaces/RouteInterface';
import { APP_NAME } from '../../config/index';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({
        msg: `Welcome to ${APP_NAME} Backend`,
      });
    });

    this.router.get(`${this.path}ping`, (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({
        msg: `${APP_NAME} Backend is active`,
      });
    });
  }
}

export { IndexRoute };
