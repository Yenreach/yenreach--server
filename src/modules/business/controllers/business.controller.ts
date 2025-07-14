import { NextFunction, Response, Request } from 'express';
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
import { RequestWithBody, RequestWithParam, RequestWithParamAndBody, RequestWithParamAndQuery, RequestWithQuery } from '../../../shared/types';

class BusinessController {
  private readonly businessService: IBusinessService;

  constructor(businessService: IBusinessService) {
    this.businessService = businessService;
    this.getBusiness = this.getBusiness.bind(this);
    this.getBusinesses = this.getBusinesses.bind(this);
    this.getUserBusinesses = this.getUserBusinesses.bind(this);
    this.getAllBusinessProducts = this.getAllBusinessProducts.bind(this);
    this.getAllBusinessJobs = this.getAllBusinessJobs.bind(this);
    this.createBusiness = this.createBusiness.bind(this);
    this.updateBusiness = this.updateBusiness.bind(this);
    this.reviewBussiness = this.reviewBussiness.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getStates = this.getStates.bind(this);
    this.getLga = this.getLga.bind(this);
    this.getRelatedBusiness = this.getRelatedBusiness.bind(this);
    this.getCurrentBusinessOfTheWeek = this.getCurrentBusinessOfTheWeek.bind(this);
  }

  public async getCurrentBusinessOfTheWeek(req: Request, res: Response, next: NextFunction) {
    try {
      const businessOfTheWeek = await this.businessService.getCurrentBusinessOfTheWeek();
      return sendResponse(res, HttpCodes.OK, 'Business of the week gotten successfully', businessOfTheWeek);
    } catch (error) {
      next(error);
    }
  }

  public async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.businessService.getBusinessCategories();
      return sendResponse(res, HttpCodes.OK, 'Categories fetched successfully', categories);
    } catch (error) {
      next(error);
    }
  }

  public async getStates(req: Request, res: Response, next: NextFunction) {
    try {
      const states = await this.businessService.getStates();
      return sendResponse(res, HttpCodes.OK, 'States fetched successfully', states);
    } catch (error) {
      next(error);
    }
  }

  public async getLga(
    req: RequestWithParam<{
      id: string;
    }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const lgas = await this.businessService.getLgas(req.params.id);
      return sendResponse(res, HttpCodes.OK, 'Lgas fetched successfully', lgas);
    } catch (error) {
      next(error);
    }
  }

  public async getRelatedBusiness(
    req: RequestWithParamAndQuery<
      {
        id: string;
      },
      {
        limit: string;
      }
    >,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const limit = parseInt(req.query.limit, 10) || 10;
      const relatedBusinesses = await this.businessService.getRelatedBusinesses(req.params.id, limit);
      return sendResponse(res, HttpCodes.OK, 'Related Businesses fetched sucessfully', relatedBusinesses);
    } catch (error) {
      next(error);
    }
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

  public async getBusinesses(req: RequestWithQuery<BusinessQueryParams>, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = req.query.search || '';
      const businesses = await this.businessService.getBusinesses(page, limit, search);
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
