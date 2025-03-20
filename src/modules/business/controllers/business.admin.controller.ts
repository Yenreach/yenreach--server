import { IBusinessAdminService } from '../interfaces';

export class BusinessAdminController {
  private readonly businessAdminService: IBusinessAdminService;

  constructor(businessAdminService: IBusinessAdminService) {
    this.businessAdminService = businessAdminService;
  }  
}
