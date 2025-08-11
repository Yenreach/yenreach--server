import { NextFunction, Request, Response } from 'express';
import { SettingsService } from '../../modules/settings/services';
import { SettingValue } from '../../shared/types/common';
import { HttpException } from '../exceptions';
import { HttpCodes } from '../constants';

export const requireSetting = (settingName: string, expectedValue?: SettingValue) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settingsService = SettingsService.getInstance();
      const setting = await settingsService.getSetting(settingName);

      if (setting === null || setting === undefined) {
        throw new HttpException(HttpCodes.SERVICE_UNAVAILABLE, `Setting ${settingName} not configured`);
      }

      if (expectedValue !== undefined && setting !== expectedValue) {
        throw new HttpException(HttpCodes.SERVICE_UNAVAILABLE, 'Service unavailable');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
