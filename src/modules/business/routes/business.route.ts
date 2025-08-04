import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../lib/routes/interfaces';
import { BusinessService } from '../services';
import { BusinessController } from '../controllers';
import { authMiddleware } from '../../../lib/middlewares';

class BusinessRoute implements Routes {
  public path = '/business';
  public router = Router();
  public businessService: BusinessService;
  public businessController: BusinessController;

  constructor() {
    this.businessService = new BusinessService();

    this.businessController = new BusinessController(this.businessService);

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.get(`/states`, this.businessController.getStates);
    this.router.get(`/states/:id/lgas`, this.businessController.getLga);
    this.router.get(`${this.path}/categories`, this.businessController.getCategories);
    this.router.get(`${this.path}/:id/related`, this.businessController.getRelatedBusiness);
    this.router.get(`${this.path}/business-of-the-week`, this.businessController.getCurrentBusinessOfTheWeek);
    this.router.get(`${this.path}/:id`, this.businessController.getBusiness);
    this.router.get(`${this.path}`, this.businessController.getBusinesses);
    this.router.get(`/user${this.path}`, authMiddleware, this.businessController.getUserBusinesses);
    this.router.get(`${this.path}/:id/products`, authMiddleware, this.businessController.getAllBusinessProducts);
    this.router.get(`${this.path}/:id/jobs`, authMiddleware, this.businessController.getAllBusinessJobs);
    this.router.post(`${this.path}`, authMiddleware, this.businessController.createBusiness);
    this.router.put(`${this.path}/:id`, authMiddleware, this.businessController.updateBusiness);
    this.router.post(`${this.path}/:id/review`, authMiddleware, this.businessController.reviewBussiness);
  }
}

export { BusinessRoute };
