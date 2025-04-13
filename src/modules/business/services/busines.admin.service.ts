import { Between } from 'typeorm';
import AppDataSource from '../../../core/database';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { IBusinessAdminService } from '../interfaces';
import { UpdateBusinessDto } from '../schemas';
import { Businesses } from '../../../core/database/postgres/businesses.entity';
import { BusinessRegistrationState } from '../enums';

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
        registrationStatus: BusinessRegistrationState.PENDING,
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
        registrationStatus: BusinessRegistrationState.INCOMPLETE,
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
    business.registrationStatus = BusinessRegistrationState.APPROVED;
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
    await this.businessRepository.delete(business);
  }
}
