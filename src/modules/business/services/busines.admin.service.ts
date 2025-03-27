import { Between } from 'typeorm';
import AppDataSource from '../../../core/databases';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { Businesses } from '../entities/businesses.entity';
import { IBusinessAdminService } from '../interfaces';
import { UpdateBusinessDto } from '../schemas';

export class BusinessAdminService implements IBusinessAdminService {
  private readonly businessRepository = AppDataSource.getRepository(Businesses);

  public async getAllBusinesses(page = 1, limit = 10): Promise<PaginationResponse<Businesses>> {
    const { skip } = calculatePagination(page, limit);
    const [businesses, total] = await this.businessRepository.findAndCount({
      skip,
      take: limit,
    });
    return paginate(businesses, total, page, limit);
  }
  public async getPendingBusinesses(page = 1, limit = 10): Promise<PaginationResponse<Businesses>> {
    const { skip } = calculatePagination(page, limit);
    const [businesses, total] = await this.businessRepository.findAndCount({
      where: {
        regStage: Between(2, 3),
      },
      skip,
      take: limit,
    });
    return paginate(businesses, total, page, limit);
  }
  public async getIncompleteBusinesses(page = 1, limit = 10): Promise<PaginationResponse<Businesses>> {
    const { skip } = calculatePagination(page, limit);
    const [businesses, total] = await this.businessRepository.findAndCount({
      where: {
        regStage: 1,
      },
      skip,
      take: limit,
    });
    return paginate(businesses, total, page, limit);
  }
  public async approveBusiness(businessId: string): Promise<Businesses> {
    const business = await this.businessRepository.findOne({
      where: {
        verifyString: businessId,
      },
    });
    if (!business) throw new Error('Business not found');
    business.regStage = 4;
    return await this.businessRepository.save(business);
  }
  public async declineBusiness(businessId: string): Promise<Businesses> {
    throw new Error('Method not implemented.');
  }
  public async editBusinness(businessId: string, data: UpdateBusinessDto): Promise<Businesses> {
    const business = await this.businessRepository.findOneBy({ verifyString: businessId });
    if (!business) throw new Error('Business not found');
    Object.assign(business, data);
    return await this.businessRepository.save(business);
  }
  public async deleteBusiness(businessId: string): Promise<void> {
    const business = await this.businessRepository.findOne({
      where: {
        verifyString: businessId,
      },
    });
    if (!business) throw new Error('Business not found');
    business.regStage = 4;
    await this.businessRepository.delete(business);
  }
}
