import AppDataSource from '../../../database';
import { calculatePagination, paginate } from '../../../lib/pagination/paginate';
import { PaginationResponse } from '../../../lib/pagination/pagination.interface';
import { BusinessDto, IBusinessService } from '../interfaces';
import { AddBusinessWorkingHoursDto, AddBussinessPhotoDto, CreateBusinessDto, ReviewBusinessDto, UpdateBusinessDto } from '../schemas';
import { Businesses } from '../../../database/entities/businesses.entity';
import { BusinessReviews } from '../../../database/entities/business-reviews.entity';
import { BusinessRegistrationState } from '../enums';
import { Products } from '../../../database/entities/product.entity';
import { States } from '../../../database/entities/states.entity';
import { LocalGovernments } from '../../../database/entities/local-governments.entity';
import { Jobs } from '../../../database/entities/jobs.entity';
import { BusinessWorkingHours } from '../../../database/entities/business-working-hours.entity';
import { BusinessPhotos } from '../../../database/entities/business-photos.entity';
import { FindManyOptions, ILike, In, Like, Not, Or } from 'typeorm';
import { HttpException } from '../../../lib/exceptions';
import { HttpCodes } from '../../../lib/constants';
import { BusinessCategories } from '../../../database/entities/business-categories.entity';
import { CategoryType } from '../../../shared/enums';
import { Categories } from '../../../database/entities/category.entity';
import { BusinessOfTheWeek } from '../../../database/entities/business-of-the-week.entity';

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
  private readonly businessCategoryRepository = AppDataSource.getRepository(BusinessCategories);
  private readonly businessOfTheWeekReposiotry = AppDataSource.getRepository(BusinessOfTheWeek);

  private transformBusiness = (business: Businesses) => {
    return {
      ...business,
      categories: business.categories,
      photos: business.photos,
      state: business.state?.name,
      lga: business.lga?.name,
      reviews: business.reviews,
    };
  };

  public async createBusiness(data: CreateBusinessDto, userId: string): Promise<any> {
    const [state, lga] = await Promise.all([this.stateRepository.findOneBy({ id: data.stateId }), this.lgaRepository.findOneBy({ id: data.lgaId })]);

    if (!state) throw new HttpException(HttpCodes.BAD_REQUEST, 'State not found');
    if (!lga) throw new HttpException(HttpCodes.BAD_REQUEST, 'Lga not found');
    if (lga.stateId !== state.id) throw new HttpException(HttpCodes.BAD_REQUEST, 'Lga does not belong to state');

    const registrationStatus = data.coverImg && data.profileImg ? BusinessRegistrationState.PENDING : BusinessRegistrationState.INCOMPLETE;

    const { photos: medias, categories: catIds, ...businessData } = data;

    const newBusiness = this.businessRepository.create({
      ...businessData,
      registrationStatus,
      userId,
    });

    const savedBusiness = await this.businessRepository.save(newBusiness);

    const categories = await this.categoryRepository.findBy({
      id: In(catIds),
    });
    const businessCategories = categories.map(category => ({
      businessId: savedBusiness.id,
      categoryId: category.id,
    }));

    await this.businessCategoryRepository.save(businessCategories);

    const photos = medias.map(media => ({
      mediaPath: media,
      businessId: savedBusiness.id,
    }));

    await this.businessPhotoRepository.save(photos);

    return this.transformBusiness(savedBusiness);
  }

  public async updateBusiness(id: string, data: UpdateBusinessDto): Promise<Businesses> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['categories', 'photos'],
    });

    if (!business) throw new Error('Business not found');

    Object.assign(business, data);

    const { photos: medias, categories: catIds } = data;

    if (catIds && catIds.length > 0) {
      const existingCategories = new Set(business.categories.map(c => c.categoryId));
      const newCategories = catIds.filter(id => !existingCategories.has(id));
      const categoriesToRemove = business.categories.filter(c => !catIds.includes(c.categoryId));

      if (categoriesToRemove.length > 0) {
        await this.businessCategoryRepository.remove(categoriesToRemove);
      }

      if (newCategories.length > 0) {
        const categoryEntities = newCategories.map(categoryId => this.businessCategoryRepository.create({ categoryId, businessId: business.id }));
        await this.businessCategoryRepository.save(categoryEntities);
      }
    }

    if (medias && medias.length > 0) {
      const existingPhotos = new Set(business.photos.map(p => p.mediaPath));
      const newPhotos = medias.filter(media => !existingPhotos.has(media));
      const photosToRemove = business.photos.filter(p => !medias.includes(p.mediaPath));

      if (photosToRemove.length > 0) {
        await this.businessPhotoRepository.remove(photosToRemove);
      }

      if (newPhotos.length > 0) {
        const photoEntities = newPhotos.map(mediaPath => this.businessPhotoRepository.create({ mediaPath, businessId: business.id }));
        await this.businessPhotoRepository.save(photoEntities);
      }
    }

    return await this.businessRepository.save(business);
  }

  public async getBusinessByUserId(userId: string, page = 1, limit = 10): Promise<PaginationResponse<any>> {
    const { skip } = calculatePagination(page, limit);
    const [businesses, total] = await this.businessRepository.findAndCount({
      where: {
        userId: userId,
      },
      relations: {
        categories: {
          category: true,
        },
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

  public async getCurrentBusinessOfTheWeek(): Promise<BusinessOfTheWeek | null> {
    return (
      (
        await this.businessOfTheWeekReposiotry.find({
          // latest one
          order: {
            createdAt: 'DESC',
          },
          relations: {
            business: {
              categories: {
                category: true,
              },
            },
          },
          take: 1,
        })
      )?.[0] ?? null
    );
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
