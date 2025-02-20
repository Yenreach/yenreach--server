import { NextFunction, Request, Response } from 'express';
import { IBusinessService } from '../interfaces';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';

class BusinessController {
  private readonly businessService: IBusinessService;

  constructor(businessService: IBusinessService) {
    this.businessService = businessService;
  }

  async getAllBusinesses(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const products = await this.businessService.getAllBusinesses(page, limit);

      return sendResponse(res, HttpCodes.OK, 'products fetched successfully', products);
    } catch (error) {
      next(error);
    }
  }
}

export { BusinessController };
