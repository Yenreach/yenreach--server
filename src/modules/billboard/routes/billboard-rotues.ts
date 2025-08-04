import { NextFunction, Router, Request, Response } from 'express';
import { Routes } from '../../../lib/routes/interfaces';
import { BillboardController } from '../controllers/billboard.controller';

class BillboardRoute implements Routes {
  public path = '/billboards';
  public router = Router();
  public controller = new BillboardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.get(`${this.path}`, this.controller.getActiveBillboards);
  }
}

export { BillboardRoute };
