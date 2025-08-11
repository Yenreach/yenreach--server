import { object } from 'zod';
import AppDataSource from '../../../database';
import { BlackFridayDeals } from '../../../database/entities/black-friday-deals.entity';
import { Products } from '../../../database/entities/product.entity';
import { HttpCodes } from '../../../lib/constants';
import { HttpException } from '../../../lib/exceptions';
import { CreateBlackFridayDealDto, GetProductsDto, UpdateBlackFridayDealDto } from '../schemas/products.schema';
import { ProductsService } from './products.service';
import { calculatePagination, paginate } from '../../../lib/pagination/paginate';
import { FindManyOptions, ILike, MoreThan, Repository } from 'typeorm';
import { ProductStatus } from '../enums';
import { PaginationResponse } from '../../../lib/pagination/pagination.interface';

class ProductAdminService {
  private readonly dataSource = AppDataSource;
  private readonly productService: ProductsService;
  private readonly blackFridayDealRepository: Repository<BlackFridayDeals>;

  constructor() {
    this.productService = new ProductsService();
    this.blackFridayDealRepository = this.dataSource.getRepository(BlackFridayDeals);
  }

  public async createBlackFridayDeal(data: CreateBlackFridayDealDto): Promise<BlackFridayDeals> {
    return this.dataSource.manager.transaction(async manager => {
      const blackFridayRepository = manager.getRepository(BlackFridayDeals);
      const productRepository = manager.getRepository(Products);
      let product: Products;

      if (data.type === 'existing') {
        product = await productRepository.findOne({ where: { id: data.productId } });
        if (!product) throw new HttpException(HttpCodes.NOT_FOUND, 'Product not found');
      } else {
        product = await this.productService.createProduct(data, manager);
      }

      const deal = blackFridayRepository.create({
        productId: product.id,
        discountedPrice: data.discountedPrice,
        discountPercentage: (data.discountedPrice / product.price) * 100,
        dealEndDate: data.dealEndDate,
      });

      return manager.save(deal);
    });
  }

  public async getBlackFridayDeals({ page = 1, limit = 20, search = '', category }: GetProductsDto): Promise<PaginationResponse<BlackFridayDeals>> {
    const { skip } = calculatePagination(page, limit);

    const baseWhere = {
      dealEndDate: MoreThan(new Date()), // dealEndDate > now
      product: {
        status: ProductStatus.Available,
        ...(category && { categories: { categoryId: category } }),
      },
    };

    let where: FindManyOptions<BlackFridayDeals>['where'] = baseWhere;

    if (search) {
      where = [
        {
          ...baseWhere,
          product: {
            ...baseWhere.product,
            name: ILike(`%${search}%`),
          },
        },
        {
          ...baseWhere,
          product: {
            ...baseWhere.product,
            description: ILike(`%${search}%`),
          },
        },
      ];
    }

    const findOptions: FindManyOptions<BlackFridayDeals> = {
      relations: ['product', 'product.categories', 'product.photos'],
      where,
      skip,
      take: limit,
    };

    const [deals, total] = await this.blackFridayDealRepository.findAndCount(findOptions);

    // const productsWithDeals = deals.map(deal => ({
    //   ...deal.product,
    //   blackFridayDeal: {
    //     discountedPrice: deal.discountedPrice,
    //     discountPercentage: deal.discountPercentage,
    //     dealEndDate: deal.dealEndDate,
    //   },
    // }));

    return paginate(deals, total, page, limit);
  }

  public async getAllBlackFridayDeals(page = 1, limit = 10): Promise<PaginationResponse<BlackFridayDeals>> {
    const { skip } = calculatePagination(page, limit);

    const [deals, total] = await this.blackFridayDealRepository.findAndCount({
      relations: ['product', 'product.categories', 'product.photos'],
      skip,
      take: limit,
    });

    return paginate(deals, total, page, limit);
  }

  public async updateBlackFridayDeal(dealId: string, data: UpdateBlackFridayDealDto): Promise<BlackFridayDeals> {
    return this.dataSource.manager.transaction(async manager => {
      const blackFridayRepository = manager.getRepository(BlackFridayDeals);
      const { dealEndDate, discountedPrice, ...rest } = data;

      const deal = await blackFridayRepository.findOne({ where: { id: dealId } });
      if (!deal) throw new HttpException(HttpCodes.NOT_FOUND, 'Black Friday Product not found');

      const product = await this.productService.updateProduct(deal.productId, data);

      const updateData = { dealEndDate, discountedPrice, discountPercentage: (data.discountedPrice / product.price) * 100 };

      Object.assign(deal, updateData);

      return blackFridayRepository.save(deal);
    });
  }

  public async getBlackFridayDealById(id: string): Promise<BlackFridayDeals | null> {
    return this.blackFridayDealRepository.findOne({
      where: { id },
      relations: ['product', 'product.categories', 'product.photos'],
    });
  }

  public async deleteBlackFridayDeal(id: string): Promise<boolean> {
    const result = await this.blackFridayDealRepository.delete(id);
    return result.affected > 0;
  }
}

export { ProductAdminService };
