import { Equal, FindManyOptions, ILike, LessThan, MoreThanOrEqual, Not } from 'typeorm';
import AppDataSource from '../../../database';
import { calculatePagination, paginate } from '../../../lib/pagination/paginate';
import { PaginationResponse } from '../../../lib/pagination/pagination.interface';
import { IBusinessAdminService } from '../interfaces';
import { UpdateBusinessDto } from '../schemas';
import { Businesses } from '../../../database/entities/businesses.entity';
import { BusinessRegistrationState } from '../enums';
import { BusinessPhotos } from '../../../database/entities/business-photos.entity';
import { BusinessCategories } from '../../../database/entities/business-categories.entity';
import { BusinessOfTheWeek } from '../../../database/entities/business-of-the-week.entity';
import { HttpException } from '../../../lib/exceptions';
import { HttpCodes } from '../../../lib/constants';
import { expiresInDays } from '../../../lib/utils/helpers';

export class BusinessAdminService implements IBusinessAdminService {
  private readonly businessRepository = AppDataSource.getRepository(Businesses);
  private readonly businessPhotoRepository = AppDataSource.getRepository(BusinessPhotos);
  private readonly businessCategoryRepository = AppDataSource.getRepository(BusinessCategories);
  private readonly businessOfTheWeekReposiotry = AppDataSource.getRepository(BusinessOfTheWeek);

  private async getActiveBusinessOfTheWeek() {
    return this.businessOfTheWeekReposiotry.findOneBy({
      startDate: MoreThanOrEqual(new Date()),
      expiresAt: LessThan(new Date()),
    });
  }

  public async addBusinessOfTheWeek(businessId: string): Promise<BusinessOfTheWeek> {
    const businessOfTheWeek = await this.getActiveBusinessOfTheWeek();

    if (businessOfTheWeek) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'There is an active business of the week, update to change');
    }

    const business = await this.businessRepository.findOneBy({ id: businessId, registrationStatus: BusinessRegistrationState.APPROVED });

    if (!business) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'Business does not exist');
    }

    const newBusinessOfTheWeek = this.businessOfTheWeekReposiotry.create({
      businessId,
      startDate: new Date(),
      expiresAt: expiresInDays(7),
    });

    return this.businessOfTheWeekReposiotry.save(newBusinessOfTheWeek);
  }

  public async updateBusinessOfTheWeek(businessId: string): Promise<BusinessOfTheWeek> {
    const businessOfTheWeek = await this.getActiveBusinessOfTheWeek();

    if (!businessOfTheWeek) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'There is no active business of the week, proceed to add');
    }

    const business = await this.businessRepository.findOneBy({ id: businessId, registrationStatus: BusinessRegistrationState.APPROVED });

    if (!business) {
      throw new HttpException(HttpCodes.BAD_REQUEST, 'Business does not exist');
    }

    Object.assign(businessOfTheWeek, {
      expiresAt: new Date(),
    });

    await this.businessOfTheWeekReposiotry.save(businessOfTheWeek);

    const newBusinessOfTheWeek = this.businessOfTheWeekReposiotry.create({
      businessId,
      startDate: new Date(),
      expiresAt: expiresInDays(7),
    });

    return this.businessOfTheWeekReposiotry.save(newBusinessOfTheWeek);
  }
  public async getCurrentBusinessOfTheWeek(): Promise<BusinessOfTheWeek | null> {
    return this.getCurrentBusinessOfTheWeek();
  }

  public async getAllBusinesses(page = 1, limit = 10, search?: string): Promise<PaginationResponse<Businesses>> {
    const { skip } = calculatePagination(page, limit);

    const queryConditions: FindManyOptions<Businesses> = {
      where: {
        registrationStatus: Not(Equal(BusinessRegistrationState.DECLINED)),
      },
      relations: {
        user: true,
      },
      skip,
      take: limit,
    };

    if (search) {
      queryConditions.where = [
        { ...queryConditions.where, name: ILike(`%${search}%`) },
        { ...queryConditions.where, description: ILike(`%${search}%`) },
        // { ...queryConditions.where, categories: { category: Like(`%${search}%`) } },
      ];
    }

    const [businesses, total] = await this.businessRepository.findAndCount(queryConditions);

    return paginate(businesses, total, page, limit);
  }

  public async getPendingBusinesses(page = 1, limit = 10): Promise<PaginationResponse<Businesses>> {
    const { skip } = calculatePagination(page, limit);
    const [businesses, total] = await this.businessRepository.findAndCount({
      where: {
        registrationStatus: BusinessRegistrationState.PENDING,
      },
      relations: {
        user: true,
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
      relations: {
        user: true,
      },
      skip,
      take: limit,
    });
    return paginate(businesses, total, page, limit);
  }

  public async approveBusiness(businessId: string): Promise<Businesses> {
    const business = await this.businessRepository.findOne({
      where: {
        id: businessId,
      },
    });
    if (!business) throw new Error('Business not found');
    business.registrationStatus = BusinessRegistrationState.APPROVED;
    return await this.businessRepository.save(business);
  }

  public async declineBusiness(businessId: string): Promise<Businesses> {
    const business = await this.businessRepository.findOne({
      where: {
        id: businessId,
      },
    });
    if (!business) throw new Error('Business not found');
    business.registrationStatus = BusinessRegistrationState.DECLINED;
    return await this.businessRepository.save(business);
  }

  public async editBusinness(businessId: string, data: UpdateBusinessDto): Promise<Businesses> {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
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

  public async deleteBusiness(businessId: string): Promise<void> {
    const business = await this.businessRepository.findOne({
      where: {
        id: businessId,
      },
    });
    if (!business) throw new Error('Business not found');
    await this.businessRepository.delete(business);
  }
}
