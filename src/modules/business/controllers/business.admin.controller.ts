import { NextFunction, Response } from 'express';
import { IBusinessAdminService, PathParams } from '../interfaces';
import { RequestWithParam } from '../../../types/express';
import { HttpCodes } from '../../../core/constants';
import { sendResponse } from '../../../core/utils';

export class BusinessAdminController {
  private readonly businessAdminService: IBusinessAdminService;

  constructor(businessAdminService: IBusinessAdminService) {
    this.businessAdminService = businessAdminService;
  }

  public async approveBusiness(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id;
      const approveBusiness = await this.businessAdminService.approveBusiness(businessId);
      return sendResponse(res, HttpCodes.OK, 'Business approved successfully', approveBusiness);
    } catch (error) {
      next(error);
    }
  }

  public async deleteBusiness(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id;
      await this.businessAdminService.deleteBusiness(businessId);
      return sendResponse(res, HttpCodes.OK, 'Business deleted sucessfully');
    } catch (error) {
      next(error);
    }
  }
}
