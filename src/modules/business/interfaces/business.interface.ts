import { BusinessCategories } from '../../../database/entities/business-categories.entity';
import { BusinessOfTheWeek } from '../../../database/entities/business-of-the-week.entity';
import { BusinessPhotos } from '../../../database/entities/business-photos.entity';
import { BusinessReviews } from '../../../database/entities/business-reviews.entity';
import { BusinessWorkingHours } from '../../../database/entities/business-working-hours.entity';
import { Businesses } from '../../../database/entities/businesses.entity';
import { Categories } from '../../../database/entities/category.entity';
import { Jobs } from '../../../database/entities/jobs.entity';
import { LocalGovernments } from '../../../database/entities/local-governments.entity';
import { Products } from '../../../database/entities/product.entity';
import { States } from '../../../database/entities/states.entity';
import { PaginationResponse } from '../../../lib/pagination/pagination.interface';

import { AddBusinessWorkingHoursDto, AddBussinessPhotoDto, CreateBusinessDto, ReviewBusinessDto, UpdateBusinessDto } from '../schemas';

interface IBusinessService {
  getStates(): Promise<States[]>;
  getRelatedBusinesses(businessId: string, limit?: number): Promise<BusinessDto[]>;
  getLgas(stateId: string): Promise<LocalGovernments[]>;
  getBusinessCategories(): Promise<Categories[]>;
  getBusinesses(page?: number, limit?: number, search?: string): Promise<PaginationResponse<BusinessDto>>;
  getBusinessById(id: string): Promise<BusinessDto>;
  getJobsByBusinessId(businessId: string, page?: number, limit?: number): Promise<PaginationResponse<Jobs>>;
  getProductsByBusinessId(businessId: string, page?: number, limit?: number): Promise<PaginationResponse<Products>>;
  deleteBusinessProductById(businessId: string, productId: string): Promise<boolean>;
  createBusiness(data: CreateBusinessDto, userId: string): Promise<Businesses>;
  updateBusiness(id: string, data: UpdateBusinessDto): Promise<Businesses>;
  getBusinessByUserId(userId: string, page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  addWorkingHours(businessId: string, data: AddBusinessWorkingHoursDto): Promise<BusinessWorkingHours>;
  reviewBusiness(businessId: string, userId: string, data: ReviewBusinessDto): Promise<BusinessReviews>;
  addBusinessPhotos(businessId: string, data: AddBussinessPhotoDto): Promise<BusinessPhotos>;
  getCurrentBusinessOfTheWeek(): Promise<BusinessOfTheWeek | null>;
  // addBusinessBranch(businessId: string): Promise<any>;
  // addBusinessFacitlity(businessId: string): Promise<any>;
}

interface IBusinessAdminService {
  getAllBusinesses(page?: number, limit?: number, search?: string): Promise<PaginationResponse<Businesses>>;
  getPendingBusinesses(page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  getIncompleteBusinesses(page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  approveBusiness(businessId: string): Promise<Businesses>;
  declineBusiness(businessId: string): Promise<Businesses>;
  editBusinness(businessId: string, data: UpdateBusinessDto): Promise<Businesses>;
  deleteBusiness(businessId: string): Promise<void>;
  addBusinessOfTheWeek(businessId: string): Promise<BusinessOfTheWeek>;
  updateBusinessOfTheWeek(businessId: string): Promise<BusinessOfTheWeek>;
  getCurrentBusinessOfTheWeek(): Promise<BusinessOfTheWeek | null>;
}

type BusinessDto = {
  name: string;
  userId: string;
  description: string;
  address: string;
  lgaId: string;
  town: string;
  stateId: string;
  state: string;
  lga: string;
  email: string;
  phoneNumber: string;
  whatsapp: string;
  website: string;
  twitterLink: string;
  instagramLink: string;
  youtubeLink: string;
  cv: string;
  profileImg: string;
  coverImg: string;
  monthStarted: string;
  yearStarted: string;
  categories: BusinessCategories[];
  photos: BusinessPhotos[];
  reviews: BusinessReviews[];
};

export type PathParams = {
  id: string;
};

export type BusinessQueryParams = {
  page?: string;
  limit?: string;
  search?: string;
};

export { IBusinessService, BusinessDto, IBusinessAdminService };
