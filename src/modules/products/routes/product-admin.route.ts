import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../lib/routes/interfaces';
import { adminAuthMiddleware, authMiddleware } from '../../../lib/middlewares';
import { validateRequest } from '../../../lib/middlewares/ValidationMiddleware';
import { CreateBlackFridayDealSchema } from '../schemas/products.schema';
import { z } from 'zod';
import { ProductsAdminController } from '../controllers/products-admin.controller';

class ProductsAdminRoute implements Routes {
  public path = '/admin/products';
  public router = Router();
  private readonly ProductsAdminController: ProductsAdminController;

  constructor() {
    this.ProductsAdminController = new ProductsAdminController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(
      `${this.path}`,
      adminAuthMiddleware,
      validateRequest([z.object({ body: CreateBlackFridayDealSchema })]),
      this.ProductsAdminController.createBlackFridayProducts,
    );
  }
}

export { ProductsAdminRoute };
