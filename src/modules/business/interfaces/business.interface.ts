interface IBusinessService {
  getAllBusinesses(page: number, limit: number): Promise<any>;
}

export { IBusinessService };
