import { RequestWithBody, RequestWithParam, RequestWithParamAndBody, RequestWithQuery } from '../../../shared/types';
import { NextFunction, Response } from 'express';
import { sendResponse } from '../../../lib/utils';
import { HttpCodes } from '../../../lib/constants';
import { BillboardAdminService } from '../services';
import { CreateBillboardEntryDto, UpdateBillboardEntryDto } from '../schemas';
import { PathParams } from '../../../shared/types/common';
import { PaginationQueryParams } from '../../../lib/pagination';
import { PaginationResponse } from '../../../lib/pagination/pagination.interface';
import { BillboardEntry } from '../../../database/entities/billboard-entries.entity';
import { BillboardStatus } from '../../../shared/enums/common.enum';

const billboardAdminService = new BillboardAdminService();

export class BillboardAdminController {
  public async addToBillboard(req: RequestWithBody<CreateBillboardEntryDto>, res: Response, next: NextFunction) {
    try {
      const entry = await billboardAdminService.addToBillboard(req.body, req.admin.id);
      return sendResponse(res, HttpCodes.CREATED, 'Billboard entry created', entry);
    } catch (error) {
      next(error);
    }
  }

  public async updateBillboard(req: RequestWithParamAndBody<PathParams, UpdateBillboardEntryDto>, res: Response, next: NextFunction) {
    try {
      const entry = await billboardAdminService.updateBillboardEntry(req.params.id, req.body);
      return sendResponse(res, HttpCodes.OK, 'Billboard entry updated', entry);
    } catch (error) {
      next(error);
    }
  }

  public async getBillboardsNew(req: RequestWithQuery<PaginationQueryParams & { status: BillboardStatus }>, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await billboardAdminService.getBillboards(page, limit, status);

      return sendResponse(res, HttpCodes.OK, `Billboards (${status}) fetched`, result);
    } catch (error) {
      next(error);
    }
  }

  public async getBillboards(req: RequestWithQuery<PaginationQueryParams & { status: string }>, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      let result: PaginationResponse<BillboardEntry> | BillboardEntry[];

      switch (status) {
        case 'active':
          result = await billboardAdminService.getActiveBillboard();
          break;
        case 'pending':
          result = await billboardAdminService.getPendingBillboards(page, limit);
          break;
        case 'expired':
          result = await billboardAdminService.getExpiredBillboards(page, limit);
          break;
        default:
          return sendResponse(res, HttpCodes.BAD_REQUEST, 'Invalid status query param');
      }

      return sendResponse(res, HttpCodes.OK, `Billboards (${status}) fetched`, result);
    } catch (error) {
      next(error);
    }
  }

  public async deleteBillboard(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      await billboardAdminService.deleteBillboard(req.params.id);
      return sendResponse(res, HttpCodes.OK, 'Billboard deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }
}
