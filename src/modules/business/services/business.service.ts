import AppDataSource from '../../../core/database';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { BusinessDto, IBusinessService } from '../interfaces';
import { AddBusinessWorkingHoursDto, AddBussinessPhotoDto, CreateBusinessDto, ReviewBusinessDto, UpdateBusinessDto } from '../schemas';
import { Businesses } from '../../../core/database/postgres/businesses.entity';
import { BusinessReviews } from '../../../core/database/postgres/business-reviews.entity';
import { BusinessRegistrationState } from '../enums';
import { Products } from '../../../core/database/postgres/product.entity';
import { States } from '../../../core/database/postgres/states.entity';
import { LocalGovernments } from '../../../core/database/postgres/local-governments.entity';
import { Jobs } from '../../../core/database/postgres/jobs.entity';
import { BusinessWorkingHours } from '../../../core/database/postgres/business-working-hours.entity';
import { BusinessPhotos } from '../../../core/database/postgres/business-photos.entity';
import { FindManyOptions, ILike, Like, Or } from 'typeorm';

export class BusinessService implements IBusinessService {
  private readonly businessRepository = AppDataSource.getRepository(Businesses);
  private readonly businessPhotoRepository = AppDataSource.getRepository(BusinessPhotos);
  private readonly businessReviewRepository = AppDataSource.getRepository(BusinessReviews);
  private readonly BusinessWorkingHoursRepository = AppDataSource.getRepository(BusinessWorkingHours);
  private readonly jobRepository = AppDataSource.getRepository(Jobs);
  private readonly productRepository = AppDataSource.getRepository(Products);
  private readonly stateRepository = AppDataSource.getRepository(States);
  private readonly lGaRepository = AppDataSource.getRepository(LocalGovernments);

  private transformBusiness = (business: Businesses) => {
    return {
      ...business,
      categories: business.categories.map(c => c.category.category),
      photos: business.photos.map(p => p.mediaPath),
      state: business.state?.name,
      lga: business.lga?.name,
    };
  };

  public async createBusiness(data: CreateBusinessDto, userId: string): Promise<Businesses> {
    const state = this.stateRepository.findOneBy({ id: data.stateId });
    if (!state) {
      throw new Error('State not found');
    }

    const lga = this.lGaRepository.findOneBy({ id: data.lgaId });

    if (!lga) {
      throw new Error('Lga not found');
    }

    let registrationStatus = BusinessRegistrationState.INCOMPLETE;

    if (data.coverImg && data.profileImg) {
      registrationStatus = BusinessRegistrationState.PENDING;
    }
    const baseData: Partial<Businesses> = {
      registrationStatus,
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

  public async getBusinessByUserId(userId: string, page = 1, limit = 10): Promise<PaginationResponse<any>> {
    const { skip } = calculatePagination(page, limit);
    const [businesses, total] = await this.businessRepository.findAndCount({
      where: {
        userId: userId,
      },
      relations: {
        categories: true,
        photos: true,
        workingHours: true,
        reviews: true,
      },
      skip,
      take: limit,
    });

    const transformedBusiness = businesses.map(this.transformBusiness);

    return paginate(transformedBusiness, total, page, limit);
  }

  public async getBusinesses(page = 1, limit = 10, search?: string): Promise<PaginationResponse<BusinessDto>> {
    const { skip } = calculatePagination(page, limit);

    const queryConditions: FindManyOptions<Businesses> = {
      where: {
        registrationStatus: BusinessRegistrationState.APPROVED,
      },
      skip,
      take: limit,
      relations: {
        categories: {
          category: true,
        },
        photos: true,
        workingHours: true,
        reviews: true,
        state: true,
        lga: true,
      },
    };

    console.log(search);
    if (search) {
      queryConditions.where = [
        { ...queryConditions.where, name: ILike(`%${search}%`) },
        { ...queryConditions.where, description: ILike(`%${search}%`) },
        // { ...queryConditions.where, categories: { category: Like(`%${search}%`) } },
      ];
    }

    const [businesses, total] = await this.businessRepository.findAndCount(queryConditions);

    const transformedBusiness = businesses.map(this.transformBusiness);

    return paginate(transformedBusiness, total, page, limit);
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
        businessId: businessId,
      },
      skip,
      take: limit,
    });

    return paginate(jobs, total, page, limit);
  }

  public async getProductsByBusinessId(businessId: string, page = 1, limit = 10): Promise<PaginationResponse<Products>> {
    const { skip } = calculatePagination(page, limit);
    const [products, total] = await this.productRepository.findAndCount({
      where: {
        businessId: businessId,
      },
      skip,
      take: limit,
    });

    return paginate(products, total, page, limit);
  }

  public async deleteBusinessProductById(businessId: string, productId: string): Promise<boolean> {
    const product = await this.productRepository.findOneBy({
      id: productId,
      businessId: businessId,
    });
    if (!product) throw new Error('Product not found');
    const result = await this.productRepository.delete(product);
    return result.affected > 0;
  }

  public async addWorkingHours(businessId: string, data: AddBusinessWorkingHoursDto): Promise<BusinessWorkingHours> {
    const business = await this.businessRepository.findOneBy({ id: businessId });
    if (!business) throw new Error('Business not found');
    const workingHours = this.BusinessWorkingHoursRepository.create(data);
    return await this.BusinessWorkingHoursRepository.save(workingHours);
  }

  public async reviewBusiness(businessId: string, userId: string, data: ReviewBusinessDto): Promise<BusinessReviews> {
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

  public async addBusinessPhotos(businessId: string, data: AddBussinessPhotoDto): Promise<BusinessPhotos> {
    const business = await this.businessRepository.findOneBy({ verifyString: businessId });
    if (!business) throw new Error('Business not found');
    const newpPhoto = this.businessPhotoRepository.create({
      ...data,
      businessId,
    });
    return await this.businessPhotoRepository.save(newpPhoto);
  }

  // public async addBusinessBranch(businessId: string): Promise<any> {
  //   const business = await this.businessRepository.findOneBy({ verifyString: businessId });
  //   if (!business) throw new Error('Business not found');

  //   throw new Error('Method not implemented.');
  // }
  // public async addBusinessFacitlity(businessId: string): Promise<any> {
  //   const business = await this.businessRepository.findOneBy({ verifyString: businessId });
  //   if (!business) throw new Error('Business not found');
  //   throw new Error('Method not implemented.');
  // }
}
