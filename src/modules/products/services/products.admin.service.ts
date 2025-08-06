import AppDataSource from '../../../database';
import { BlackFridayDeals } from '../../../database/entities/black-friday-deals.entity';
import { Products } from '../../../database/entities/product.entity';
import { HttpCodes } from '../../../lib/constants';
import { HttpException } from '../../../lib/exceptions';
import { CreateBlackFridayDealDto } from '../schemas/products.schema';
import { ProductsService } from './products.service';

class ProductAdminService {
  private readonly dataSource = AppDataSource;
  private readonly productService: ProductsService;

  constructor() {
    this.productService = new ProductsService();
  }

  public async createBlackFridayDeal(data: CreateBlackFridayDealDto) {
    return this.dataSource.manager.transaction(async manager => {
      let product: Products;

      if (data.type === 'existing') {
        product = await manager.findOne(Products, { where: { id: data.productId } });
        if (!product) throw new HttpException(HttpCodes.NOT_FOUND, 'Product not found');
      } else {
        product = await this.productService.createProduct(data, manager);
      }

      const deal = manager.create(BlackFridayDeals, {
        productId: product.id,
        discountedPrice: data.discountedPrice,
        discountPercentage: (data.discountedPrice / product.price) * 100,
        dealEndDate: data.dealEndDate,
      });

      return manager.save(deal);
    });
  }
}
