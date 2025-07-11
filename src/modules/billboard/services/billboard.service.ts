import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import AppDataSource from '../../../core/database';
import { BillboardEntry } from '../../../core/database/postgres/billboard-entries.entity';
import { BillboardStatus } from '../../../shared/enums/common.enum';

export class BillboardService {
  private readonly billboardRepository = AppDataSource.getRepository(BillboardEntry);

  public async getActiveBillboard() {
    const now = new Date();
    return this.billboardRepository.find({
      where: {
        status: BillboardStatus.Approved,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
      take: 10,
    });
  }
}
