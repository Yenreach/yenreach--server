import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../lib/routes/interfaces';
import { PlanController } from '../controllers/plan.controller';

class PlanRoute implements Routes {
  public path = '/plans';
  public router = Router();
  public PlanController = new PlanController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(`${this.path}/`, this.PlanController.create);
    this.router.get(`${this.path}`, this.PlanController.findAll);
    // this.router.get(`${this.path}/:id`, this.PlanController.findById);
    this.router.put(`${this.path}/:id`, this.PlanController.update);
    this.router.delete(`${this.path}/:id`, this.PlanController.delete);
  }
}

export { PlanRoute };
