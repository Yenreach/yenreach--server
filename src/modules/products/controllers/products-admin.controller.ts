import { NextFunction, Request, Response } from 'express';

import { sendResponse } from '../../../lib/utils';
import { HttpCodes } from '../../../lib/constants';
import { CreateBlackFridayDealDto, GetProductsDto, UpdateBlackFridayDealDto } from '../schemas/products.schema';
import { ProductAdminService } from '../services';

const productsAdminService = new ProductAdminService();
class ProductsAdminController {
  constructor() {}

  public async createBlackFridayProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productsData: CreateBlackFridayDealDto = req.body;
      const newProducts = await productsAdminService.createBlackFridayDeal(productsData);
      return sendResponse(res, HttpCodes.CREATED, 'Product created successfully', newProducts);
    } catch (error) {
      next(error);
    }
  }

  public async getBlackFridayDealById(req: Request, res: Response, next: NextFunction) {
    try {
      const dealId = req.params.id;
      const deal = await productsAdminService.getBlackFridayDealById(dealId);
      if (!deal) return sendResponse(res, HttpCodes.NOT_FOUND, 'Black Friday deal not found');
      return sendResponse(res, HttpCodes.OK, 'Black Friday deal retrieved successfully', deal);
    } catch (error) {
      next(error);
    }
  }

  public async getBlackFridayDeals(req: Request, res: Response, next: NextFunction) {
    try {
      const query: GetProductsDto = req.query;
      const deals = await productsAdminService.getBlackFridayDeals(query);
      return sendResponse(res, HttpCodes.OK, 'Black Friday deals retrieved successfully', deals);
    } catch (error) {
      next(error);
    }
  }

  public async getAllBlackFridayDeals(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const deals = await productsAdminService.getAllBlackFridayDeals(page, limit);
      return sendResponse(res, HttpCodes.OK, 'All Black Friday deals retrieved successfully', deals);
    } catch (error) {
      next(error);
    }
  }

  public async updateBlackFridayDeal(req: Request, res: Response, next: NextFunction) {
    try {
      const dealId = req.params.id;
      const data: UpdateBlackFridayDealDto = req.body;
      const updatedDeal = await productsAdminService.updateBlackFridayDeal(dealId, data);
      return sendResponse(res, HttpCodes.OK, 'Black Friday deal updated successfully', updatedDeal);
    } catch (error) {
      next(error);
    }
  }

  public async deleteBlackFridayDeal(req: Request, res: Response, next: NextFunction) {
    try {
      const dealId = req.params.id;
      const deleted = await productsAdminService.deleteBlackFridayDeal(dealId);
      if (!deleted) return sendResponse(res, HttpCodes.NOT_FOUND, 'Black Friday deal not found');
      return sendResponse(res, HttpCodes.NO_CONTENT, 'Black Friday deal deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsAdminController };
