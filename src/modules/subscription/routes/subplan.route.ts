import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../core/routes/interfaces';
import { SubPlanController } from '../controllers/subplan.controller';

class SubPlanRoute implements Routes {
  public path = '/subplans';
  public router = Router();
  public SubPlanController = new SubPlanController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(`${this.path}/`, this.SubPlanController.create);
    this.router.get(`${this.path}`, this.SubPlanController.findAll);
    // this.router.get(`${this.path}/:id`, this.SubPlanController.findById);
    this.router.put(`${this.path}/:id`, this.SubPlanController.update);
    this.router.delete(`${this.path}/:id`, this.SubPlanController.delete);
  }
}

export { SubPlanRoute };
