import { NextFunction, Response, Request } from 'express';
import { BusinessQueryParams, IBusinessAdminService, PathParams } from '../interfaces';
import { HttpCodes } from '../../../lib/constants';
import { sendResponse } from '../../../lib/utils';
import { UpdateBusinessDto } from '../schemas';
import { RequestWithParam, RequestWithParamAndBody, RequestWithQuery } from '../../../shared/types';

export class BusinessAdminController {
  private readonly businessAdminService: IBusinessAdminService;

  constructor(businessAdminService: IBusinessAdminService) {
    this.businessAdminService = businessAdminService;
    this.approveBusiness = this.approveBusiness.bind(this);
    this.declineBusiness = this.declineBusiness.bind(this);
    this.editBusiness = this.editBusiness.bind(this);
    this.getBusinesses = this.getBusinesses.bind(this);
    this.deleteBusiness = this.deleteBusiness.bind(this);
    this.getCurrentBusinessOfTheWeek = this.getCurrentBusinessOfTheWeek.bind(this);
    this.updateBusinessOfTheWeek = this.updateBusinessOfTheWeek.bind(this);
    this.addBusinessOfTheWeek = this.addBusinessOfTheWeek.bind(this);
  }

  public async getCurrentBusinessOfTheWeek(req: Request, res: Response, next: NextFunction) {
    try {
      const businessOfTheWeek = await this.businessAdminService.getCurrentBusinessOfTheWeek();
      return sendResponse(res, HttpCodes.OK, 'Business of the week gotten successfully', businessOfTheWeek);
    } catch (error) {
      next(error);
    }
  }

  public async addBusinessOfTheWeek(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id;
      const businessOfTheWeek = await this.businessAdminService.addBusinessOfTheWeek(businessId);
      return sendResponse(res, HttpCodes.CREATED, 'Business of the week added Sucessfully', businessOfTheWeek);
    } catch (error) {
      next(error);
    }
  }

  public async updateBusinessOfTheWeek(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id;
      const businessOfTheWeek = await this.businessAdminService.updateBusinessOfTheWeek(businessId);
      return sendResponse(res, HttpCodes.CREATED, 'Business of the week updated sucessfully', businessOfTheWeek);
    } catch (error) {
      next(error);
    }
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
      const search = req.query.search || '';

      if (type == 'pending') {
        const pendingBusinesses = await this.businessAdminService.getPendingBusinesses(page, limit);
        return sendResponse(res, HttpCodes.OK, 'Pending businesses request sucessfull', pendingBusinesses);
      }

      if (type == 'incomplete') {
        const incompleteBusinesses = await this.businessAdminService.getIncompleteBusinesses(page, limit);
        return sendResponse(res, HttpCodes.OK, 'Incomplete businesses request sucessfull', incompleteBusinesses);
      }

      const allBusinesses = await this.businessAdminService.getAllBusinesses(page, limit, search);

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
