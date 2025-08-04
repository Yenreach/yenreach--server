import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../lib/routes/interfaces';
// import { authMiddleware } from '../../../core/middlewares';
import { CmsController } from '../controllers';
import { CmsService } from '../services';

class CmsRoute implements Routes {
  public path = '/cms';
  public router = Router();
  public CmsService = new CmsService();
  public CmsController = new CmsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(`${this.path}/`, this.CmsController.create);
    this.router.get(`${this.path}`, this.CmsController.getAll);
    this.router.get(`${this.path}/:id`, this.CmsController.getById);
    this.router.delete(`${this.path}/hero-images/:imageId`, this.CmsController.removeHeroImage);
  }
}

export { CmsRoute };
