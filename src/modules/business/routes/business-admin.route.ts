import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../core/routes/interfaces';
import { authMiddleware } from '../../../core/middlewares';
import { BusinessAdminService } from '../services/busines.admin.service';
import { BusinessAdminController } from '../controllers/business-admin.controller';

class BusinessRoute implements Routes {
  public path = '/admin/business';
  public router = Router();
  public businessAdminService = new BusinessAdminService();
  public businessAdminController = new BusinessAdminController(this.businessAdminService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.get(`${this.path}/`, authMiddleware, this.businessAdminController.getBusinesses);
    this.router.patch(`${this.path}/:id`, authMiddleware, this.businessAdminController.editBusiness);
    this.router.post(`${this.path}/:id/approve`, authMiddleware, this.businessAdminController.approveBusiness);
    this.router.post(`${this.path}/:id/decline`, authMiddleware, this.businessAdminController.declineBusiness);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.businessAdminController.deleteBusiness);
  }
}

export { BusinessRoute };
