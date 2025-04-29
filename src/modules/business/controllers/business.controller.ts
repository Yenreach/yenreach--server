import { NextFunction, Response } from 'express';
import { BusinessQueryParams, IBusinessService, PathParams } from '../interfaces';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import {
  AddBusinessReviewSchema,
  CreateBusinessDto,
  CreateBusinessSchema,
  ReviewBusinessDto,
  UpdateBusinessDto,
  UpdateBusinessSchema,
} from '../schemas';
import { RequestWithBody, RequestWithParam, RequestWithParamAndBody, RequestWithParamAndQuery, RequestWithQuery } from '../../../types/express';

class BusinessController {
  private readonly businessService: IBusinessService;

  constructor(businessService: IBusinessService) {
    this.businessService = businessService;
  }

  public async createBusiness(req: RequestWithBody<CreateBusinessDto>, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const businessData = req.body;
      CreateBusinessSchema.parse(businessData);
      const newBusiness = await this.businessService.createBusiness(businessData, userId);
      return sendResponse(res, HttpCodes.OK, 'business created successfully', newBusiness);
    } catch (error) {
      next(error);
    }
  }

  public async updateBusiness(req: RequestWithParamAndBody<PathParams, UpdateBusinessDto>, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id;
      const businessData = req.body;
      UpdateBusinessSchema.parse(businessData);
      const updatedBusiness = await this.businessService.updateBusiness(businessId, businessData);
      return sendResponse(res, HttpCodes.OK, 'business created successfully', updatedBusiness);
    } catch (error) {
      next(error);
    }
  }

  public async getUserBusinesses(req: RequestWithQuery<BusinessQueryParams>, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const businesses = await this.businessService.getBusinessByUserId(userId, page, limit);
      return sendResponse(res, HttpCodes.OK, 'User businesses fetched successfully', businesses);
    } catch (error) {
      next(error);
    }
  }

  public async getBusiness(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id;
      const business = await this.businessService.getBusinessById(businessId);
      return sendResponse(res, HttpCodes.OK, 'business fetched successfully', business);
    } catch (error) {
      next(error);
    }
  }

  public async getAllBusinesses(req: RequestWithQuery<BusinessQueryParams>, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const businesses = await this.businessService.getAllBusinesses(page, limit);
      return sendResponse(res, HttpCodes.OK, 'businesses fetched successfully', businesses);
    } catch (error) {
      next(error);
    }
  }

  public async getAllBusinessProducts(req: RequestWithParamAndQuery<PathParams, BusinessQueryParams>, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const businessId = req.params.id;
      const businessProducts = await this.businessService.getProductsByBusinessId(businessId, page, limit);
      return sendResponse(res, HttpCodes.OK, 'business products fetched successfully', businessProducts);
    } catch (error) {
      next(error);
    }
  }

  public async getAllBusinessJobs(req: RequestWithParamAndQuery<PathParams, BusinessQueryParams>, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const businessId = req.params.id;
      const businessJobs = await this.businessService.getJobsByBusinessId(businessId, page, limit);
      return sendResponse(res, HttpCodes.OK, 'business jobs fetched successfully', businessJobs);
    } catch (error) {
      next(error);
    }
  }

  public async reviewBussiness(req: RequestWithParamAndBody<PathParams, ReviewBusinessDto>, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const businessId = req.params.id;
      AddBusinessReviewSchema.parse(req.body);
      const businessReview = await this.businessService.reviewBusiness(businessId, userId, req.body);
      return sendResponse(res, HttpCodes.OK, 'business sucessfully reviewed', businessReview);
    } catch (error) {
      next(error);
    }
  }
}

export { BusinessController };
