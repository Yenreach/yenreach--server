import { Router, Request, Response, NextFunction } from 'express';
import { Routes } from '../../../lib/routes/interfaces';
import { adminAuthMiddleware } from '../../../lib/middlewares';
import { validateRequest } from '../../../lib/middlewares/ValidationMiddleware';
import { z } from 'zod';
import { CreateBillboardEntrySchema, UpdateBillboardEntrySchema } from '../schemas/billboard.schema';
import { BillboardAdminController } from '../controllers';

class BillboardAdminRoute implements Routes {
  public path = '/admin/billboards';
  public router = Router();
  public controller = new BillboardAdminController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(
      `${this.path}`,
      adminAuthMiddleware,
      validateRequest([z.object({ body: CreateBillboardEntrySchema })]),
      this.controller.addToBillboard,
    );

    this.router.patch(
      `${this.path}/:id`,
      adminAuthMiddleware,
      validateRequest([z.object({ body: UpdateBillboardEntrySchema })]),
      this.controller.updateBillboard,
    );

    this.router.get(`${this.path}`, adminAuthMiddleware, this.controller.getBillboardsNew);

    this.router.delete(`${this.path}/:id`, adminAuthMiddleware, this.controller.deleteBillboard);
  }
}

export { BillboardAdminRoute };
