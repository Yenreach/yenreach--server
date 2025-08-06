import { NextFunction, Request, Response } from 'express';
import { ProductsService } from '../services';
import { sendResponse } from '../../../lib/utils';
import { HttpCodes } from '../../../lib/constants';
import { HttpException } from '../../../lib/exceptions';
import { AddCategoryDto, AddProductCategoryDto, CreateProductDto, GetProductsSchema, UpdateProductDto } from '../schemas/products.schema';

class ProductsController {
  private readonly productsService: ProductsService;

  constructor() {
    this.productsService = new ProductsService();
  }

  public async createProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productsData: CreateProductDto = req.body;
      const newProducts = await this.productsService.createProduct(productsData);

      return sendResponse(res, HttpCodes.CREATED, 'product created successfully', newProducts);
    } catch (error) {
      next(error);
    }
  }

  public async updateProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const updateData: UpdateProductDto = req.body;
      const updatedProduct = await this.productsService.updateProduct(productId, updateData);
      return sendResponse(res, HttpCodes.OK, 'product updated successfully', updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  public async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const products = await this.productsService.getAllProducts(page, limit);

      return sendResponse(res, HttpCodes.OK, 'products fetched successfully', products);
    } catch (error) {
      next(error);
    }
  }

  public async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await this.productsService.getProductCategories();
      return sendResponse(res, HttpCodes.OK, 'Categories fetched successfully', categories);
    } catch (error) {
      next(error);
    }
  }

  public async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams = GetProductsSchema.parse(req.query);
      const result = await this.productsService.getProducts(queryParams);

      return sendResponse(res, HttpCodes.OK, 'Products retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  public async getBusinessProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const business = req.params.business_id;
      const queryParams = GetProductsSchema.parse(req.query);

      if (!business) throw Error('Business ID must be sent');

      const result = await this.productsService.getProducts({ ...queryParams, business });

      return sendResponse(res, HttpCodes.OK, 'Products retrieved successfully', result);
    } catch (error) {
      next(error);
    }
  }

  public async getRelatedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const products = await this.productsService.getRelatedProducts(productId);
      return sendResponse(res, HttpCodes.OK, 'related products fetched successfully', products);
    } catch (error) {
      next(error);
    }
  }

  public async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const products = await this.productsService.getProductById(productId);
      if (!products) {
        throw new HttpException(HttpCodes.NOT_FOUND, 'product do not exists');
      }
      return sendResponse(res, HttpCodes.OK, 'product fetched successfully', products);
    } catch (error) {
      next(error);
    }
  }

  public async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = req.params.id;
      const result = await this.productsService.deleteProduct(productId);
      return sendResponse(res, HttpCodes.OK, 'product deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }

  public async addPhoto(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.productsService.addPhoto(req.body);
      return sendResponse(res, HttpCodes.CREATED, 'Photo added successfully', result);
    } catch (error) {
      next(error);
    }
  }

  public async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data: AddCategoryDto = req.body;
      const result = await this.productsService.createCategory(data);

      return sendResponse(res, HttpCodes.CREATED, 'category CREATED successfully', result);
    } catch (error) {
      next(error);
    }
  }

  public async addProductCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const data: AddProductCategoryDto = req.body;
      const result = await this.productsService.addProductCategory(data);

      return sendResponse(res, HttpCodes.CREATED, 'category added successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export { ProductsController };
