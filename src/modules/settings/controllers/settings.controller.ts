import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services';
import { sendResponse } from '../../../lib/utils';
import { HttpCodes } from '../../../lib/constants';
import { CreateSettingsDto } from '../schema';

export class SettingsController {
  private readonly SettingService: SettingsService;

  constructor() {
    this.SettingService = SettingsService.getInstance();
  }

  public async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await this.SettingService.getSettings();
      return sendResponse(res, HttpCodes.OK, 'Settings Retrived successfully', settings);
    } catch (error) {
      next(error);
    }
  }

  public async createSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateSettingsDto;
      const setting = await this.SettingService.createSetting(data);
      return sendResponse(res, HttpCodes.OK, 'Setting created successfully', setting);
    } catch (error) {
      next(error);
    }
  }

  public async getSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.params.name;
      const setting = await this.SettingService.getSetting(name);
      return sendResponse(res, HttpCodes.OK, 'Setting Retrived successfully', setting);
    } catch (error) {
      next(error);
    }
  }
}
