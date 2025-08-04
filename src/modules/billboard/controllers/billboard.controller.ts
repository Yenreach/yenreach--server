import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../../../lib/utils';
import { HttpCodes } from '../../../lib/constants';
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
