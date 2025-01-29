import { NextFunction, Request, Response } from 'express';
import { ProductsService } from '../services';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { HttpException } from '../../../core/exceptions';
import { CreateProductDto, UpdateProductDto } from '../schemas/products.schema';

const productsService = new ProductsService();

class ProductsController {
  public test = new ProductsService()
  async createProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productsData: CreateProductDto = req.body;
      const newProducts = await productsService.createProduct(productsData);

      return sendResponse(res, HttpCodes.CREATED, "product created successfully", newProducts)
    } catch (error) {
      next(error)
    }
  }

  async updateProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseInt(req.params.id);
      const updateData: UpdateProductDto = req.body;
      const updatedProduct = await productsService.updateProduct(productId, updateData);
      return sendResponse(res, HttpCodes.OK, "product updated successfully", updatedProduct)
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const products = await productsService.getAllProducts(page, limit);

      return sendResponse(res, HttpCodes.OK, "products fetched successfully", products)
    } catch (error) {
      next(error)
    }
  }

  async getProductsById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseInt(req.params.id);
      const products = await productsService.getProductById(productId);
      if (!products) {
        throw new HttpException(HttpCodes.NOT_FOUND, "product do not exists");
      }
      return sendResponse(res, HttpCodes.OK, "product fetched successfully", products)
    } catch (error) {
      next(error)
    }
  }

  async deleteProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = parseInt(req.params.id);
      const result = await productsService.deleteProduct(productId);
      return sendResponse(res, HttpCodes.OK, "product deleted successfully", result)
    } catch (error) {
      next(error)
    }
  }
}

export { ProductsController }
