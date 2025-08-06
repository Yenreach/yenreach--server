import { NextFunction, Request, Response } from 'express';
import { ProductAdminService } from '../services';
import { sendResponse } from '../../../lib/utils';
import { HttpCodes } from '../../../lib/constants';
import { CreateBlackFridayDealDto } from '../schemas/products.schema';

class ProductsAdminController {
  private readonly productsAdminService: ProductAdminService;

  constructor() {
    this.productsAdminService = new ProductAdminService();
  }

  public async createBlackFridayProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productsData: CreateBlackFridayDealDto = req.body;
      const newProducts = await this.productsAdminService.createBlackFridayDeal(productsData);
      return sendResponse(res, HttpCodes.CREATED, 'product created successfully', newProducts);
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsAdminController };
