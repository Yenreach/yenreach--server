import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { BillboardService } from '../services/billboard.service';

const billboardService = new BillboardService();

export class BillboardController {
  public async getActiveBillboards(req: Request, res: Response, next: NextFunction) {
    try {
      const entries = await billboardService.getActiveBillboard();
      return sendResponse(res, HttpCodes.OK, 'Active billboards fetched', entries);
    } catch (error) {
      next(error);
    }
  }
}
