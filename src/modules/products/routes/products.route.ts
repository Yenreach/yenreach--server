import { Request, Response, NextFunction, Router } from 'express';
import { ProductsController } from '../controllers';
import { Routes } from '../../../core/routes/interfaces';
import { authMiddleware } from '../../../core/middlewares';
import { validateRequest } from '../../../core/middlewares/ValidationMiddleware';
import { AddCategorySchema, AddProductCategorySchema, ProductSchema } from '../schemas/products.schema';
import { z } from 'zod';

class ProductsRoute implements Routes {
  public path = '/products';
  public router = Router();
  public ProductsController = new ProductsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.post(`${this.path}`, authMiddleware, validateRequest([z.object({ body: ProductSchema })]), this.ProductsController.createProducts)

    this.router.get(`${this.path}`, this.ProductsController.getProducts)

    this.router.get(`${this.path}/all`, this.ProductsController.getAllProducts)

    this.router.get(`${this.path}/:id`, this.ProductsController.getProductById)

    this.router.get(`${this.path}/:id/related`, this.ProductsController.getRelatedProducts)

    this.router.get(`${this.path}/:business_string/products`, this.ProductsController.getBusinessProducts)

    this.router.put(`${this.path}/:id`, this.ProductsController.updateProducts)

    this.router.delete(`${this.path}/:id`, this.ProductsController.deleteProduct)
    
    // product photos
    this.router.post(`${this.path}/add-photo`, authMiddleware, this.ProductsController.addPhoto)
    
    // product categories
    this.router.post(`${this.path}/categories`, authMiddleware, validateRequest([AddCategorySchema]), this.ProductsController.createCategory)

    this.router.post(`${this.path}/assign-category`, authMiddleware, validateRequest([AddProductCategorySchema]), this.ProductsController.addProductCategory)


  }
}

export { ProductsRoute };

