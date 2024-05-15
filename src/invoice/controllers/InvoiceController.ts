import { NextFunction, Request, Response } from 'express';
import { InvoiceRequester } from '../services';
import { sendResponse } from '@/core/utils';
import { HttpCodes } from '@/core/constants';
import { Invoice as IInvoice } from '../interfaces';
import { logger } from '@/core/utils';
import { RequestWithUser } from '@/auth/interfaces';
import { InvoiceProvider } from '../providers';

class InvoiceController {
    public invoiceProvider = new InvoiceProvider();

    public createInvoice = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = await this.invoiceProvider.createInvoice({ ...req.body as IInvoice, user: req.user._id });
            return sendResponse(res, HttpCodes.OK, 'Invoice created successfully', data);
        } catch (error) {
            next(logger.error(error));
        }
    }

    public getUserInvoices = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = await this.invoiceProvider.getUserInvoices(req.user._id);
            return sendResponse(res, HttpCodes.OK, 'User Invoices retrieved successfully', data);
        } catch (error) {
            next(logger.error(error));
        }
    }

    public getInvoiceInfo = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const data = await this.invoiceProvider.getInvoiceInfo(req.params.id);
            return sendResponse(res, HttpCodes.OK, 'Invoice retrieved successfully', data);
        } catch (error) {
            next(logger.error(error));
        }
    }

    public deleteInvoice = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            await this.invoiceProvider.deleteInvoice(req.params.id);
            return sendResponse(res, HttpCodes.OK, 'Invoice deleted successfully');
        } catch (error) {
            next(logger.error(error));
        }
    }
}

export { InvoiceController };
