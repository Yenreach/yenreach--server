import { BusinessCategories } from '../../../core/database/postgres/business-categories.entity';
import { BusinessPhotos } from '../../../core/database/postgres/business-photos.entity';
import { BusinessReviews } from '../../../core/database/postgres/business-reviews.entity';
import { BusinessWorkingHours } from '../../../core/database/postgres/business-working-hours.entity';
import { Businesses } from '../../../core/database/postgres/businesses.entity';
import { Categories } from '../../../core/database/postgres/category.entity';
import { Jobs } from '../../../core/database/postgres/jobs.entity';
import { LocalGovernments } from '../../../core/database/postgres/local-governments.entity';
import { Products } from '../../../core/database/postgres/product.entity';
import { States } from '../../../core/database/postgres/states.entity';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';

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
  // addBusinessBranch(businessId: string): Promise<any>;
  // addBusinessFacitlity(businessId: string): Promise<any>;
}

interface IBusinessAdminService {
  getAllBusinesses(page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  getPendingBusinesses(page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  getIncompleteBusinesses(page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  approveBusiness(businessId: string): Promise<Businesses>;
  declineBusiness(businessId: string): Promise<Businesses>;
  editBusinness(businessId: string, data: UpdateBusinessDto): Promise<Businesses>;
  deleteBusiness(businessId: string): Promise<void>;
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
