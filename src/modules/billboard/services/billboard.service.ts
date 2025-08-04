import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import AppDataSource from '../../../database';
import { BillboardEntry } from '../../../database/entities/billboard-entries.entity';
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
