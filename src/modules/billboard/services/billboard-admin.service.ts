import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import AppDataSource from '../../../core/database';
import { BillboardEntry } from '../../../core/database/postgres/billboard-entries.entity';
import { BillboardStatus } from '../../../shared/enums/common.enum';
import { CreateBillboardEntryDto, UpdateBillboardEntryDto } from '../schemas';
import { Businesses } from '../../../core/database/postgres/businesses.entity';
import { HttpException } from '../../../core/exceptions';
import { HttpCodes } from '../../../core/constants';
import { BusinessRegistrationState } from '../../business/enums';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';

export class BillboardAdminService {
  private readonly billboardRepository = AppDataSource.getRepository(BillboardEntry);
  private readonly businessReposiotory = AppDataSource.getRepository(Businesses);

  private async getActiveBillboardCount() {
    const now = new Date();
    return this.billboardRepository.countBy({
      status: BillboardStatus.Approved,
      startDate: LessThanOrEqual(now),
      endDate: MoreThanOrEqual(now),
    });
  }

  public async addToBillboard(data: CreateBillboardEntryDto, adminId: string) {
    const count = await this.getActiveBillboardCount();

    if (count >= 10) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'Billboard is already filled');
    }

    let entryData: Partial<BillboardEntry> = {
      startDate: data.startDate,
      endDate: data.endDate,
      status: BillboardStatus.Approved,
      adminId: adminId,
    };

    if (data.businessId) {
      const business = await this.businessReposiotory.findOneBy({ id: data.businessId, registrationStatus: BusinessRegistrationState.APPROVED });

      if (!business) throw new HttpException(HttpCodes.BAD_REQUEST, 'Invalid Business');

      const now = new Date();

      const activeBusiness = await this.billboardRepository.findOneBy({
        businessId: data.businessId,
        status: BillboardStatus.Approved,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      });

      if (activeBusiness) throw new HttpException(HttpCodes.BAD_REQUEST, 'Business already active in billboard');

      entryData = {
        ...entryData,
        businessId: business.id,
        title: business.name,
        description: business.description,
        imageUrl: business.coverImg,
        ctaText: 'View Business',
        ctaLink: `https://yenreach.com/business/${business.id}`,
      };
    } else {
      entryData = {
        ...entryData,
        title: data.title!,
        description: data.description!,
        imageUrl: data.imageUrl!,
        ctaText: data.ctaText!,
        ctaLink: data.ctaLink!,
      };
    }

    const newEntry = this.billboardRepository.create(entryData);
    return this.billboardRepository.save(newEntry);
  }

  public async updateBillboardEntry(entryId: string, data: UpdateBillboardEntryDto) {
    const entry = await this.billboardRepository.findOneBy({ id: entryId });

    if (!entry) {
      throw new HttpException(HttpCodes.NOT_FOUND, 'Billboard entry not found');
    }

    if (entry.businessId) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'Cannot update business-linked billboard');
    }

    if (data.endDate < entry.startDate) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'End Date must be after Start Date');
    }

    Object.assign(entry, data);

    return this.billboardRepository.save(entry);
  }

  public async getActiveBillboard(): Promise<BillboardEntry[]> {
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

  public async getApprovedBillboard(): Promise<BillboardEntry[]> {
    const now = new Date();
    return this.billboardRepository.find({
      where: {
        status: BillboardStatus.Approved,
        // startDate: LessThanOrEqual(now),
        // endDate: MoreThanOrEqual(now),
      },
      take: 10,
    });
  }

  public async getPendingBillboards(page: number = 1, limit: number = 10): Promise<PaginationResponse<BillboardEntry>> {
    const { skip } = calculatePagination(page, limit);
    const [billboards, count] = await this.billboardRepository.findAndCount({
      where: {
        status: BillboardStatus.Pending,
      },
      skip,
      take: limit,
    });

    return paginate(billboards, count, page, limit);
  }

  public async getBillboards(page: number = 1, limit: number = 10, status?: BillboardStatus): Promise<PaginationResponse<BillboardEntry>> {
    const { skip } = calculatePagination(page, limit);

    const [billboards, count] = await this.billboardRepository.findAndCount({
      where: {
        ...(status ? { status } : {}),
      },
      skip,
      take: limit,
    });

    return paginate(billboards, count, page, limit);
  }

  public async getExpiredBillboards(page: number = 1, limit: number = 10): Promise<PaginationResponse<BillboardEntry>> {
    const { skip } = calculatePagination(page, limit);
    const now = new Date();
    const [billboards, count] = await this.billboardRepository.findAndCount({
      where: {
        status: BillboardStatus.Approved,
        endDate: LessThanOrEqual(now),
      },
      skip,
      take: limit,
    });

    return paginate(billboards, count, page, limit);
  }
}
