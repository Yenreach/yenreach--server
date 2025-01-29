import { Request, Response, NextFunction, Router } from 'express';
import { ProductsController } from '../controllers';
import { Routes } from '../../../core/routes/interfaces';
import { authMiddleware } from '../../../core/middlewares';
import { validateRequest } from '../../../core/middlewares/ValidationMiddleware';
import { ProductSchema } from '../schemas/products.schema';

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

    this.router.post(`${this.path}/`, authMiddleware, validateRequest([ProductSchema]), this.ProductsController.createProducts)

    this.router.get(`${this.path}/`, this.ProductsController.getAllProducts)

    this.router.get(`${this.path}/:id`, this.ProductsController.getProductsById)

    this.router.put(`${this.path}/:id`, this.ProductsController.updateProducts)

    this.router.delete(`${this.path}/:id`, this.ProductsController.deleteProducts)
  }
}

export { ProductsRoute };

