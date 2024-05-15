import { Request, Response, NextFunction, Router } from 'express';
import { InvoiceController } from '../controllers';
import { Routes } from '@/core/routes/interfaces';
import { authMiddleware, checkOwnership } from '@/core/middlewares';
import { Invoice } from '../models';

class InvoiceRoute implements Routes {
    public path = '/invoices';
    public router = Router();
    public invoiceController = new InvoiceController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(`${this.path}*`, authMiddleware, (req: Request, res: Response, next: NextFunction) => {
            next()
        })

        this.router.route(`${this.path}`)
            .get(this.invoiceController.getUserInvoices)
            .post(this.invoiceController.createInvoice)


        this.router.route(`${this.path}/:id`)
            .get(checkOwnership(Invoice), this.invoiceController.getInvoiceInfo)
            .delete(this.invoiceController.deleteInvoice)

    }
}

export { InvoiceRoute };

