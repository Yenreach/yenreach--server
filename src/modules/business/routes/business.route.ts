import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../core/routes/interfaces';
import { BusinessService } from '../services';
import { BusinessController } from '../controllers';

class BusinessRoute implements Routes {
  public path = '/business';
  public router = Router();
  public BusinessService = new BusinessService();
  public BusinessController = new BusinessController(this.BusinessService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    // this.router.post(`${this.path}/`, authMiddleware, validateRequest([ProductSchema]), this.ProductsController.createProducts);

    /**
     * @swagger
     * /businesses:
     *   get:
     *     summary: Get all businesses
     *     description: Fetch all businesses
     *     tags:
     *       - Business
     *     responses:
     *       200:
     *         description: Successfully fetched businesses
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   id:
     *                     type: integer
     *                   name:
     *                     type: string
     *                   location:
     *                     type: string
     *       500:
     *         description: Server error
     */
    this.router.get(`${this.path}es/`, this.BusinessController.getAllBusinesses);

    // this.router.get(`${this.path}/:id`, this.ProductsController.getProductsById);

    // this.router.put(`${this.path}/:id`, this.ProductsController.updateProducts);

    // this.router.delete(`${this.path}/:id`, this.ProductsController.deleteProducts);
  }
}

export { BusinessRoute };
