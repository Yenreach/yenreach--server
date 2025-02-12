import { Request, Response, NextFunction, Router, response } from 'express';
import { generate } from 'otp-generator'
// import { IndexController } from '@controllers/index.controller';
import { Routes } from '../../core/routes/interfaces/RouteInterface';
import APP_NAME from '../../config/env.config'
import mongoose, { Model, model, mongo } from 'mongoose';

import { Country, State, City } from 'country-state-city';

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();


  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.get(`${this.path}`, (req: Request, res: Response, next: NextFunction) => {
      return res.status(200)
        .json({
          msg: `Welcome to ${APP_NAME} Backend`
        })
    });

    this.router.get(`${this.path}ping`, (req: Request, res: Response, next: NextFunction) => {
      return res.status(200)
        .json({
          msg: `${APP_NAME} Backend is active`
        })
    });
  }
}

export { IndexRoute };
