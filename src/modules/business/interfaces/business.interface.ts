import { BusinessPhotos } from '../../../core/database/postgres/business-photos.entity';
import { BusinessReviews } from '../../../core/database/postgres/business-reviews.entity';
import { BusinessWorkingHours } from '../../../core/database/postgres/business-working-hours.entity';
import { Businesses } from '../../../core/database/postgres/businesses.entity';
import { Jobs } from '../../../core/database/postgres/jobs.entity';
import { Products } from '../../../core/database/postgres/product.entity';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';

import { AddBusinessWorkingHoursDto, AddBussinessPhotoDto, CreateBusinessDto, UpdateBusinessDto } from '../schemas';

import { ReviewBusinessDto } from '../schemas/business-review.schema';

interface IBusinessService {
  getAllBusinesses(page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  getBusinessById(id: string): Promise<Businesses | null>;
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

interface IBusiness {
  name: string;
  userString: string;
  town: string;
  lga: string;
  state: string;
  phoneNumber: string;
  whatsapp: string;
  email: string;
  website: string;
  facebookLink: string;
  twitterLink: string;
  instagramLink: string;
  youtubeLink: string;
  workingHours: string;
  cv: string;
  experience: number;
  monthStarted: number;
  modifiedBy: string;
  yearStarted: number;
  profileImg: string;
  coverImg: string;
  activation: number;
  filename: string;
  remarks: string;
  created: number;
  lastUpdated: number;
}

export type PathParams = {
  id: string;
};

export type BusinessQueryParams = {
  page?: string;
  limit?: string;
};

export { IBusinessService, IBusiness, IBusinessAdminService };
