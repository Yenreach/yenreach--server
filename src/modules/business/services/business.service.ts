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
import { FindManyOptions, ILike, In, Like, Not, Or } from 'typeorm';
import { HttpException } from '../../../core/exceptions';
import { HttpCodes } from '../../../core/constants';
import { BusinessCategories } from '../../../core/database/postgres/business-categories.entity';

import { CategoryType } from '../../../enums';
import { Categories } from '../../../core/database/postgres/category.entity';
import { isDataView } from 'node:util/types';

export class BusinessService implements IBusinessService {
  private readonly businessRepository = AppDataSource.getRepository(Businesses);
  private readonly businessPhotoRepository = AppDataSource.getRepository(BusinessPhotos);
  private readonly businessReviewRepository = AppDataSource.getRepository(BusinessReviews);
  private readonly BusinessWorkingHoursRepository = AppDataSource.getRepository(BusinessWorkingHours);
  private readonly jobRepository = AppDataSource.getRepository(Jobs);
  private readonly productRepository = AppDataSource.getRepository(Products);
  private readonly stateRepository = AppDataSource.getRepository(States);
  private readonly lgaRepository = AppDataSource.getRepository(LocalGovernments);
  private readonly categoryRepository = AppDataSource.getRepository(Categories);

  private transformBusiness = (business: Businesses) => {
    return {
      ...business,
      categories: business.categories.map(c => c.category.category),
      photos: business.photos.map(p => p.mediaPath),
      state: business.state?.name,
      lga: business.lga?.name,
      reviews: business.reviews,
    };
  };

  public async createBusiness(data: CreateBusinessDto, userId: string): Promise<Businesses> {
    const state = await this.stateRepository.findOneBy({ id: data.stateId });
    if (!state) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'State not found');
    }

    const lga = await this.lgaRepository.findOneBy({ id: data.lgaId });

    if (!lga) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'Lga not found');
    }

    if (lga.stateId != state.id) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'Lga does not belong to state');
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

  public async getBusinessById(id: string): Promise<BusinessDto> {
    const business = await this.businessRepository.findOne({
      where: {
        id,
        registrationStatus: BusinessRegistrationState.APPROVED,
      },
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
    });
    if (!business) {
      throw new HttpException(HttpCodes.NOT_FOUND, 'Business not found');
    }
    return this.transformBusiness(business);
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
    if (!product) throw new HttpException(HttpCodes.BAD_REQUEST, 'Product not found');
    const result = await this.productRepository.delete(product);
    return result.affected > 0;
  }

  public async addWorkingHours(businessId: string, data: AddBusinessWorkingHoursDto): Promise<BusinessWorkingHours> {
    const business = await this.businessRepository.findOneBy({ id: businessId });
    if (!business) throw new HttpException(HttpCodes.BAD_REQUEST, 'Business not found');
    const workingHours = this.BusinessWorkingHoursRepository.create(data);
    return await this.BusinessWorkingHoursRepository.save(workingHours);
  }

  public async reviewBusiness(businessId: string, userId: string, data: ReviewBusinessDto): Promise<BusinessReviews> {
    const business = await this.businessRepository.findOneBy({ id: businessId });
    if (!business) throw new HttpException(HttpCodes.BAD_REQUEST, 'Business not found');
    const newReview = this.businessReviewRepository.create({
      businessId: businessId,
      userId: userId,
      review: data.review,
      star: data.star,
    });
    return await this.businessReviewRepository.save(newReview);
  }

  public async addBusinessPhotos(businessId: string, data: AddBussinessPhotoDto): Promise<BusinessPhotos> {
    const business = await this.businessRepository.findOneBy({ id: businessId });
    if (!business) throw new HttpException(HttpCodes.BAD_REQUEST, 'Business not found');
    const newpPhoto = this.businessPhotoRepository.create({
      ...data,
      businessId,
    });
    return await this.businessPhotoRepository.save(newpPhoto);
  }

  public async getBusinessCategories(): Promise<Categories[]> {
    return await this.categoryRepository.find({
      where: {
        categoryType: CategoryType.Business,
      },
    });
  }

  public async getStates(): Promise<States[]> {
    return await this.stateRepository.find();
  }

  public async getLgas(stateId: string): Promise<LocalGovernments[]> {
    if (!stateId || stateId == '') throw new HttpException(HttpCodes.BAD_REQUEST, 'State id not found or invalid');
    const state = await this.stateRepository.findOneBy({ id: stateId });
    if (!state) throw new HttpException(HttpCodes.BAD_REQUEST, 'State not found');
    return await this.lgaRepository.find({
      where: {
        stateId,
      },
    });
  }

  public async getRelatedBusinesses(businessId: string, limit: number = 5): Promise<BusinessDto[]> {
    if (!businessId || businessId == '') throw new HttpException(HttpCodes.BAD_REQUEST, 'Invalid or Empty Business id');
    const business = await this.businessRepository.findOne({
      where: {
        id: businessId,
      },
      relations: {
        categories: {
          category: true,
        },
      },
    });
    if (!business) throw new HttpException(HttpCodes.BAD_REQUEST, 'Business not found');

    const categories = business.categories.map(c => c.category.id);

    const relatedBusinesses = await this.businessRepository.find({
      where: {
        id: Not(businessId),
        categories: {
          category: {
            id: In(categories),
          },
        },
      },
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
    });

    const transformedBusinesses = relatedBusinesses.map(this.transformBusiness);

    return transformedBusinesses;
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
