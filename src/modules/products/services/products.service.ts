import { AppDataSource } from '../../../core/databases';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { Products } from '../entities/products.entity';
import { CreateProductDto, UpdateProductDto } from '../schemas/products.schema';

class ProductsService {
  private readonly productRepository = AppDataSource.getRepository(Products);

  async createProduct(data: CreateProductDto): Promise<Products> {
    const newProduct = this.productRepository.create(data);
    return await this.productRepository.save(newProduct);
  }

  async updateProduct(id: number, data: UpdateProductDto): Promise<Products | null> {
    const products = await this.productRepository.findOneBy({ id });
    if (!products) {
      throw new Error('Product not found');
    }
    Object.assign(products, data);
    return await this.productRepository.save(products);
  }

  async getAllProducts(page = 1, limit = 10): Promise<PaginationResponse<Products>> {
    const { skip } = calculatePagination(page, limit);

    const [products, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
    });

    return paginate(products, total, page, limit);
  }

  async getProductById(id: number): Promise<Products | null> {
    return await this.productRepository.findOneBy({ id });
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return result.affected > 0;
  }
}

export { ProductsService }
