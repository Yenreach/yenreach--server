import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../core/routes/interfaces';
import { BusinessService } from '../services';
import { BusinessController } from '../controllers';
import { authMiddleware } from '../../../core/middlewares';

class BusinessRoute implements Routes {
  public path = '/business';
  public router = Router();
  public businessService = new BusinessService();
  public businessController = new BusinessController(this.businessService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.get(`${this.path}/:id`, this.businessController.getBusiness);
    this.router.get(`${this.path}`, this.businessController.getAllBusinesses);
    this.router.get(`user/${this.path}`, authMiddleware, this.businessController.getUserBusinesses);
    this.router.get(`${this.path}/:id/products`, authMiddleware, this.businessController.getAllBusinessProducts);
    this.router.get(`${this.path}/:id/jobs`, authMiddleware, this.businessController.getAllBusinessJobs);
    this.router.post(`${this.path}`, authMiddleware, this.businessController.createBusiness);
    this.router.put(`${this.path}/:id`, authMiddleware, this.businessController.updateBusiness);
    this.router.post(`${this.path}/:id/review`, authMiddleware, this.businessController.reviewBussiness);
  }
}

export { BusinessRoute };
