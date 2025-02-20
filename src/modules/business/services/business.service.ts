import { IBusinessService } from '../interfaces';

class BusinessService implements IBusinessService {
  public async getAllBusinesses(page: number, limit: number): Promise<any> {}
}

export { BusinessService };
