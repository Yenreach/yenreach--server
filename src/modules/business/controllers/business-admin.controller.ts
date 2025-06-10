import { NextFunction, Response } from 'express';
import { BusinessQueryParams, IBusinessAdminService, PathParams } from '../interfaces';
import { RequestWithParam, RequestWithParamAndBody, RequestWithQuery } from '../../../types/express';
import { HttpCodes } from '../../../core/constants';
import { sendResponse } from '../../../core/utils';
import { UpdateBusinessDto } from '../schemas';

export class BusinessAdminController {
  private readonly businessAdminService: IBusinessAdminService;

  constructor(businessAdminService: IBusinessAdminService) {
    this.businessAdminService = businessAdminService;
    this.approveBusiness = this.approveBusiness.bind(this);
    this.declineBusiness = this.declineBusiness.bind(this);
    this.editBusiness = this.editBusiness.bind(this);
    this.getBusinesses = this.getBusinesses.bind(this);
    this.deleteBusiness = this.deleteBusiness.bind(this);
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

  public async declineBusiness(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id;
      const declinedBusiness = await this.businessAdminService.declineBusiness(businessId);
      return sendResponse(res, HttpCodes.OK, 'Business declined sucessfully', declinedBusiness);
    } catch (error) {
      next(error);
    }
  }

  public async editBusiness(req: RequestWithParamAndBody<PathParams, UpdateBusinessDto>, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id;
      const declinedBusiness = await this.businessAdminService.editBusinness(businessId, req.body);
      return sendResponse(res, HttpCodes.OK, 'Business declined sucessfully', declinedBusiness);
    } catch (error) {
      next(error);
    }
  }

  public async getBusinesses(
    req: RequestWithQuery<
      BusinessQueryParams & {
        type?: 'all' | 'pending' | 'incomplete';
      }
    >,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { type } = req.query;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      if (type == 'pending') {
        const pendingBusinesses = await this.businessAdminService.getPendingBusinesses(page, limit);
        return sendResponse(res, HttpCodes.OK, 'Pending businesses request sucessfull', pendingBusinesses);
      }

      if (type == 'incomplete') {
        const incompleteBusinesses = await this.businessAdminService.getIncompleteBusinesses(page, limit);
        return sendResponse(res, HttpCodes.OK, 'Incomplete businesses request sucessfull', incompleteBusinesses);
      }

      const allBusinesses = await this.businessAdminService.getAllBusinesses(page, limit);

      return sendResponse(res, HttpCodes.OK, 'All Business request sucessfull', allBusinesses);
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
