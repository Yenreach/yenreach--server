import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../lib/routes/interfaces';
import { adminAuthMiddleware, validateRequest } from '../../../lib/middlewares';
import { CreateSettingsSchema, UpdateSettingsSchema } from '../schema';
import z from 'zod';
import { SettingsController } from '../controllers';

export class SettingsRoute implements Routes {
  public path = '/settings';
  public router = Router();
  private readonly settingsController: SettingsController;

  constructor() {
    this.settingsController = new SettingsController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });
    this.router.get(`${this.path}/:name`, this.settingsController.getSetting);

    this.router.get(`${this.path}`, adminAuthMiddleware, this.settingsController.getSettings);

    this.router.post(
      `${this.path}`,
      adminAuthMiddleware,
      validateRequest([z.object({ body: CreateSettingsSchema })]),
      this.settingsController.createSetting,
    );

    this.router.patch(
      `${this.path}/:name`,
      adminAuthMiddleware,
      validateRequest([z.object({ body: UpdateSettingsSchema })]),
      this.settingsController.updateSetting,
    );
  }
}
