import { Businesses } from '../../../core/database/postgres/businesses.entity';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { Jobs } from '../../jobs/entities/jobs.entity';
import { Product } from '../../products/entities/products.entity';
import { CreateBusinessDto, UpdateBusinessDto } from '../schemas';
import { ReviewBusinessDto } from '../schemas/business-review.schema';

interface IBusinessService {
  getAllBusinesses(page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  getBusinessById(id: string): Promise<Businesses | null>;
  getJobsByBusinessId(businessId: string, page?: number, limit?: number): Promise<PaginationResponse<Jobs>>;
  getProductsByBusinessId(businessId: string, page?: number, limit?: number): Promise<PaginationResponse<Product>>;
  deleteBusinessProductById(businessId: string, productId: number): Promise<boolean>;
  createBusiness(data: CreateBusinessDto, userId: string): Promise<Businesses>;
  updateBusiness(id: string, data: UpdateBusinessDto): Promise<Businesses>;
  getBusinessByUserId(userId: string, page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  addWorkingHours(businessId: string): Promise<any>;
  reviewBusiness(businessId: string, userId: string, data: ReviewBusinessDto): Promise<any>;
  addBusinessPhotos(businessId: string): Promise<any>;
  addBusinessBranch(businessId: string): Promise<any>;
  addBusinessFacitlity(businessId: string): Promise<any>;
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

export { IBusinessService, IBusiness, IBusinessAdminService };
