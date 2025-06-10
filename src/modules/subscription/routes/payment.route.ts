import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../core/routes/interfaces';
import { PaymentController } from '../controllers/payment.controller';
import { authMiddleware } from '../../../core/middlewares';

class PaymentRoute implements Routes {
  public path = '/payments';
  public router = Router();
  public PaymentController = new PaymentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(`${this.path}/`, this.PaymentController.create);
    this.router.get(`${this.path}/user/:userId`, this.PaymentController.findByUser);
    this.router.post(`${this.path}/initiate`, authMiddleware, this.PaymentController.initiatePayment);
    this.router.post(`${this.path}/verify`, this.PaymentController.verifyPayment);
    // this.router.get(`${this.path}/:id`, this.PaymentController.findById);
    this.router.put(`${this.path}/:id`, this.PaymentController.update);
    this.router.delete(`${this.path}/:id`, this.PaymentController.delete);
  }
}

export { PaymentRoute };
