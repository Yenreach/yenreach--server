import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services';
import { sendResponse } from '../../../lib/utils';
import { HttpCodes } from '../../../lib/constants';
import { CreateSettingsDto } from '../schema';

const settingService = SettingsService.getInstance();
export class SettingsController {
  constructor() {}

  public async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('called from get settings');
      const settings = await settingService.getSettings();
      return sendResponse(res, HttpCodes.OK, 'Settings Retrived successfully', settings);
    } catch (error) {
      next(error);
    }
  }

  public async createSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as CreateSettingsDto;
      const setting = await settingService.createSetting(data);
      return sendResponse(res, HttpCodes.OK, 'Setting created successfully', setting);
    } catch (error) {
      next(error);
    }
  }

  public async updateSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.params.name;
      const data = req.body as CreateSettingsDto;
      const setting = await settingService.updateSetting(name, data);
      return sendResponse(res, HttpCodes.OK, 'Setting updated successfully', setting);
    } catch (error) {
      next(error);
    }
  }

  public async getSetting(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('called from get setting');
      const name = req.params.name;
      const setting = await settingService.getSetting(name);
      return sendResponse(res, HttpCodes.OK, 'Setting Retrived successfully', setting);
    } catch (error) {
      next(error);
    }
  }
}
