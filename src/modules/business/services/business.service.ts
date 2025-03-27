import crypto from 'crypto';
import AppDataSource from '../../../core/databases';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { Jobs } from '../../jobs/entities/jobs.entity';
import { Product } from '../../products/entities/products.entity';

import { Businesses } from '../entities/businesses.entity';
import { IBusiness, IBusinessService, RegistrationState } from '../interfaces';
import { CreateBusinessDto, UpdateBusinessDto } from '../schemas';
// import { nanoid } from 'nanoid';

export class BusinessService implements IBusinessService {
  private readonly businessRepository = AppDataSource.getRepository(Businesses);
  private readonly jobRepository = AppDataSource.getRepository(Jobs);
  private readonly productRepository = AppDataSource.getRepository(Product);

  public async createBusiness(data: CreateBusinessDto, userId: string): Promise<Businesses> {
    const regState: RegistrationState = data.coverImg || data.profileImg ? 1 : 3;
    const baseData = {
      ...data,
      userString: userId,
      verifyString: crypto.randomBytes(16).toString("hex"),
      regState: regState,
      created: Date.now(),
      lastUpdated: Date.now(),
    };
    const newBusiness = this.businessRepository.create(baseData);
    return await this.businessRepository.save(newBusiness);
  }

  public async updateBusiness(id: number, data: UpdateBusinessDto): Promise<Businesses> {
    const business = await this.businessRepository.findOneBy({ id });
    if (!business) throw new Error('Business not found');
    Object.assign(business, data);
    return await this.businessRepository.save(business);
  }

  public async getBusinessByUserId(userId: string, page = 1, limit = 10): Promise<PaginationResponse<Businesses>> {
    const { skip } = calculatePagination(page, limit);
    const [businesses, total] = await this.businessRepository.findAndCount({
      where: {
        userString: userId,
      },
      skip,
      take: limit,
    });
    return paginate(businesses, total, page, limit);
  }

  public async getAllBusinesses(page = 1, limit = 10): Promise<PaginationResponse<Businesses>> {
    const { skip } = calculatePagination(page, limit);
    const [businesses, total] = await this.businessRepository.findAndCount({
      skip,
      take: limit,
    });
    return paginate(businesses, total, page, limit);
  }

  public async getBusinessById(id: number): Promise<Businesses | null> {
    const business = await this.businessRepository.findOneBy({ id });
    if (!business) {
      throw new Error('Business not found');
    }
    return business;
  }

  public async getJobsByBusinessId(businessId: string, page = 1, limit = 10): Promise<PaginationResponse<Jobs>> {
    const { skip } = calculatePagination(page, limit);
    const [jobs, total] = await this.jobRepository.findAndCount({
      where: {
        businessString: businessId,
      },
      skip,
      take: limit,
    });

    return paginate(jobs, total, page, limit);
  }

  public async getProductsByBusinessId(businessId: string, page = 1, limit = 10): Promise<PaginationResponse<Product>> {
    const { skip } = calculatePagination(page, limit);
    const [products, total] = await this.productRepository.findAndCount({
      where: {
        businessString: businessId,
      },
      skip,
      take: limit,
    });

    return paginate(products, total, page, limit);
  }

  public async deleteBusinessProductById(businessId: string, productId: number): Promise<boolean> {
    const product = await this.productRepository.findOneBy({
      id: productId,
      businessString: businessId,
    });
    if (!product) throw new Error('Product not found');
    const result = await this.productRepository.delete(product);
    return result.affected > 0;
  }

  public async addWorkingHours(businessId: string) {
    throw new Error('Method not implemented.');
  }
}
