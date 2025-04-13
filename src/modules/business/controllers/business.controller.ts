import { NextFunction, Request, Response } from 'express';
import { IBusinessService } from '../interfaces';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { CreateBusinessDto, UpdateBusinessDto } from '../schemas';

class BusinessController {
  private readonly businessService: IBusinessService;

  constructor(businessService: IBusinessService) {
    this.businessService = businessService;
  }

  public async createBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.verifyString;
      const businessData = req.body as CreateBusinessDto;
      const newBusiness = await this.businessService.createBusiness(businessData, userId);
      return sendResponse(res, HttpCodes.OK, 'business created successfully', newBusiness);
    } catch (error) {
      next(error);
    }
  }

  public async updateBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id as unknown as string;
      const businessData = req.body as UpdateBusinessDto;
      const updatedBusiness = await this.businessService.updateBusiness(businessId, businessData);
      return sendResponse(res, HttpCodes.OK, 'business created successfully', updatedBusiness);
    } catch (error) {
      next(error);
    }
  }

  public async getUserBusinesses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.verifyString;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const businesses = await this.businessService.getBusinessByUserId(userId, page, limit);
      return sendResponse(res, HttpCodes.OK, 'business fetched successfully', businesses);
    } catch (error) {
      next(error);
    }
  }

  public async getBusiness(req: Request, res: Response, next: NextFunction) {
    try {
      const businessId = req.params.id as unknown as string;
      const business = await this.businessService.getBusinessById(businessId);
      return sendResponse(res, HttpCodes.OK, 'business fetched successfully', business);
    } catch (error) {
      next(error);
    }
  }

  public async getAllBusinesses(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const businesses = await this.businessService.getAllBusinesses(page, limit);
      return sendResponse(res, HttpCodes.OK, 'businesses fetched successfully', businesses);
    } catch (error) {
      next(error);
    }
  }

  public async getAllBusinessProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const businessId = req.params.id as string;
      const businessProducts = await this.businessService.getProductsByBusinessId(businessId, page, limit);
      return sendResponse(res, HttpCodes.OK, 'business products fetched successfully', businessProducts);
    } catch (error) {
      next(error);
    }
  }

  public async getAllBusinessJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const businessId = req.params.id as string;
      const businessJobs = await this.businessService.getJobsByBusinessId(businessId, page, limit);
      return sendResponse(res, HttpCodes.OK, 'business jobs fetched successfully', businessJobs);
    } catch (error) {
      next(error);
    }
  }

  public async reviewBussiness(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.verifyString;
      const businessId = req.params.id as string;
      const businessReview = await this.businessService.reviewBusiness(businessId, userId, req.body);
      return sendResponse(res, HttpCodes.OK, 'business sucessfully reviewed', businessReview);
    } catch (error) {
      next(error);
    }
  }
}

export { BusinessController };
