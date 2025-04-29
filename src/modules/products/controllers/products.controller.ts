import { NextFunction, Request, Response } from 'express';
import { ProductsService } from '../services';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { HttpException } from '../../../core/exceptions';
import { AddCategoryDto, AddProductCategoryDto, CreateProductDto, GetProductsSchema, UpdateProductDto } from '../schemas/products.schema';


const productsService = new ProductsService(); // Initialize the service in the constructor
class ProductsController {

  async createProducts(req: Request, res: Response, next: NextFunction) {
    console.log('hereee')
    try {
      const productsData: CreateProductDto = req.body;
      console.log({ productsData, service: productsService })
      const newProducts = await productsService.createProduct(productsData);

      return sendResponse(res, HttpCodes.CREATED, 'product created successfully', newProducts);
    } catch (error) {
      next(error);
    }
  }

  async updateProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const updateData: UpdateProductDto = req.body;
      const updatedProduct = await productsService.updateProduct(productId, updateData);
      return sendResponse(res, HttpCodes.OK, 'product updated successfully', updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const products = await productsService.getAllProducts(page, limit);

      return sendResponse(res, HttpCodes.OK, 'products fetched successfully', products);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the query using Zod
      const queryParams = GetProductsSchema.parse(req.query);

      const result = await productsService.getProducts(queryParams);

      return sendResponse(res, HttpCodes.OK, "Products retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }
  
  async getBusinessProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const business = req.params.business_string;
      const queryParams = GetProductsSchema.parse(req.query);

      if (!business) throw Error('Business String must be sent')

      const result = await productsService.getProducts({ ...queryParams, business });

      return sendResponse(res, HttpCodes.OK, "Products retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getRelatedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the query using Zod
      const productId = req.params.id;
      const products = await productsService.getRelatedProducts(productId);
      return sendResponse(res, HttpCodes.OK, 'related products fetched successfully', products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const products = await productsService.getProductById(productId);
      if (!products) {
        throw new HttpException(HttpCodes.NOT_FOUND, 'product do not exists');
      }
      return sendResponse(res, HttpCodes.OK, 'product fetched successfully', products);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const result = await productsService.deleteProduct(productId);
      return sendResponse(res, HttpCodes.OK, 'product deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }

  // product photo
  async addPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productsService.addPhoto(req.body);
      return sendResponse(res, HttpCodes.CREATED, "Photo added successfully", result);
    } catch (error) {
      next(error);
    }
  }

  // product categories
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data: AddCategoryDto = req.body;
      const result = await productsService.createCategory(data);

      return sendResponse(res, HttpCodes.CREATED, 'category CREATED successfully', result);
    } catch (error) {
      next(error);
    }
  }

  async addProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data: AddProductCategoryDto = req.body;
      const result = await productsService.addProductCategory(data);

      return sendResponse(res, HttpCodes.CREATED, 'category added successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };
