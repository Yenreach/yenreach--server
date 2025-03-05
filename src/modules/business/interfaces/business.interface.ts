import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { Jobs } from '../../jobs/entities/jobs.entity';
import { Products } from '../../products/entities/products.entity';
import { Businesses } from '../entities/businesses.entity';
import { CreateBusinessDto, UpdateBusinessDto } from '../schemas';

interface IBusinessService {
  getAllBusinesses(page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
  getBusinessById(id: number): Promise<Businesses | null>;
  getJobsByBusinessId(businessId: string, page?: number, limit?: number): Promise<PaginationResponse<Jobs>>;
  getProductsByBusinessId(businessId: string, page?: number, limit?: number): Promise<PaginationResponse<Products>>;
  deleteBusinessProductById(businessId: string, productId: number): Promise<boolean>;
  createBusiness(data: CreateBusinessDto, userId: string): Promise<Businesses>;
  updateBusiness(id: number, data: UpdateBusinessDto): Promise<Businesses>;
  getBusinessByUserId(userId: string, page?: number, limit?: number): Promise<PaginationResponse<Businesses>>;
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

type RegistrationState = 1 | 2 | 3 | 4;

export { IBusinessService, IBusiness, RegistrationState };
