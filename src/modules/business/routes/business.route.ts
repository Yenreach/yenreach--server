import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../core/routes/interfaces';
import { BusinessService } from '../services';
import { BusinessController } from '../controllers';

class BusinessRoute implements Routes {
  public path = '/business';
  public router = Router();
  public businessService = new BusinessService();
  public businessController = new BusinessController(this.businessService);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

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
    this.router.get(`${this.path}es/`, this.businessController.getAllBusinesses);
  }
}

export { BusinessRoute };
