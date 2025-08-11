import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../lib/routes/interfaces';
import { adminAuthMiddleware } from '../../../lib/middlewares';
import { validateRequest } from '../../../lib/middlewares/ValidationMiddleware';
import { CreateBlackFridayDealSchema, UpdateBlackFridayDealSchema } from '../schemas/products.schema';
import { z } from 'zod';
import { ProductsAdminController } from '../controllers/products-admin.controller';
import { requireSetting } from '../../../lib/middlewares/SettingsMiddlware';

class ProductsAdminRoute implements Routes {
  public path = '/admin/products';
  public router = Router();
  private readonly productsAdminController: ProductsAdminController;

  constructor() {
    this.productsAdminController = new ProductsAdminController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => next());

    // Create Black Friday Deal
    this.router.post(
      `${this.path}/black-friday`,
      adminAuthMiddleware,
      requireSetting('is_black_friday_enabled', true),
      validateRequest([z.object({ body: CreateBlackFridayDealSchema })]),
      this.productsAdminController.createBlackFridayProducts,
    );

    // Get filtered Black Friday Deals (with search, category filters)
    this.router.get(
      `/products/black-friday`,
      adminAuthMiddleware,
      requireSetting('is_black_friday_enabled', true),
      this.productsAdminController.getBlackFridayDeals,
    );

    // Get all Black Friday Deals (no filters)
    this.router.get(
      `/products/black-friday/all`,
      adminAuthMiddleware,
      requireSetting('is_black_friday_enabled', true),
      this.productsAdminController.getAllBlackFridayDeals,
    );

    // Update Black Friday Deal
    this.router.put(
      `${this.path}/black-friday/:id`,
      adminAuthMiddleware,
      requireSetting('is_black_friday_enabled', true),
      validateRequest([z.object({ body: UpdateBlackFridayDealSchema })]),
      this.productsAdminController.updateBlackFridayDeal,
    );

    // Delete Black Friday Deal
    this.router.delete(
      `${this.path}/black-friday/:id`,
      adminAuthMiddleware,
      requireSetting('is_black_friday_enabled', true),
      this.productsAdminController.deleteBlackFridayDeal,
    );

    // Get single Black Friday Deal by ID
    this.router.get(
      `/products/black-friday/:id`,
      adminAuthMiddleware,
      requireSetting('is_black_friday_enabled', true),
      this.productsAdminController.getBlackFridayDealById,
    );
  }
}

export { ProductsAdminRoute };
