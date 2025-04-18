import crypto from 'crypto';
import AppDataSource from '../../../core/database';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { Jobs } from '../../jobs/entities/jobs.entity';
import { Products } from '../../products/entities/products.entity';
// import { nanoid } from 'nanoid';
import { IBusinessService } from '../interfaces';
import { CreateBusinessDto, UpdateBusinessDto } from '../schemas';
import { ReviewBusinessDto } from '../schemas/business-review.schema';
import { Businesses } from '../../../core/database/postgres/businesses.entity';
import { BusinessReviews } from '../../../core/database/postgres/business-reviews.entity';
import { BusinessRegistrationState } from '../enums';

export class BusinessService implements IBusinessService {
  private readonly businessRepository = AppDataSource.getRepository(Businesses);
  private readonly businessReviewRepository = AppDataSource.getRepository(BusinessReviews);
  private readonly jobRepository = AppDataSource.getRepository(Jobs);
  private readonly productRepository = AppDataSource.getRepository(Products);

  public async createBusiness(data: CreateBusinessDto, userId: string): Promise<Businesses> {
    const baseData = {
      registrationStatus: BusinessRegistrationState.INCOMPLETE,
      userId: userId,
      ...data,
    };
    const newBusiness = this.businessRepository.create(baseData);
    return await this.businessRepository.save(newBusiness);
  }

  public async updateBusiness(id: string, data: UpdateBusinessDto): Promise<Businesses> {
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

  public async getBusinessById(id: string): Promise<Businesses | null> {
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
    const business = await this.businessRepository.findOneBy({ verifyString: businessId });
    if (!business) throw new Error('Business not found');
    throw new Error('Method not implemented.');
  }
  public async reviewBusiness(businessId: string, userId: string, data: ReviewBusinessDto): Promise<any> {
    const business = await this.businessRepository.findOneBy({ verifyString: businessId });
    if (!business) throw new Error('Business not found');
    const newReview = this.businessReviewRepository.create({
      businessId: businessId,
      userId: userId,
      review: data.review,
      star: data.star,
    });
    return await this.businessReviewRepository.save(newReview);
  }
  public async addBusinessPhotos(businessId: string): Promise<any> {
    const business = await this.businessRepository.findOneBy({ verifyString: businessId });
    if (!business) throw new Error('Business not found');
    throw new Error('Method not implemented.');
  }
  public async addBusinessBranch(businessId: string): Promise<any> {
    const business = await this.businessRepository.findOneBy({ verifyString: businessId });
    if (!business) throw new Error('Business not found');

    throw new Error('Method not implemented.');
  }
  public async addBusinessFacitlity(businessId: string): Promise<any> {
    const business = await this.businessRepository.findOneBy({ verifyString: businessId });
    if (!business) throw new Error('Business not found');
    throw new Error('Method not implemented.');
  }
}
