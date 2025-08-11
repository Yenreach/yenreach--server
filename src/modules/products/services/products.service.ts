import { EntityManager, FindManyOptions, ILike } from 'typeorm';
import AppDataSource from '../../../database';
import { calculatePagination, paginate } from '../../../lib/pagination/paginate';
import { PaginationResponse } from '../../../lib/pagination/pagination.interface';
import {
  AddCategoryDto,
  AddProductCategoryDto,
  AddProductPhotoDto,
  AddProductPhotoSchema,
  CreateProductDto,
  GetProductsDto,
  RemoveProductCategoryDto,
  RemoveProductCategorySchema,
  RemoveProductPhotoDto,
  RemoveProductPhotoSchema,
  UpdateProductDto,
} from '../schemas/products.schema';
import { Products } from '../../../database/entities/product.entity';
import { ProductPhotos } from '../../../database/entities/product-photos.entity';
import { ProductCategories } from '../../../database/entities/product-category.entity';
import { ProductStatus } from '../enums';
import { Categories } from '../../../database/entities/category.entity';
import { CategoryType } from '../../../shared/enums';

class ProductsService {
  private readonly dataSource = AppDataSource;
  private readonly categoryRepository = AppDataSource.getRepository(Categories);
  private readonly productRepository = AppDataSource.getRepository(Products);
  private readonly productCategoryRepository = AppDataSource.getRepository(ProductCategories);
  private readonly productPhotoRepository = AppDataSource.getRepository(ProductPhotos);

  public async createProduct(data: CreateProductDto, manager?: EntityManager): Promise<any> {
    const executeTransaction = async (entityManager: EntityManager) => {
      const { photos: medias, categories: catIds, ...productData } = data;
      const productRepository = entityManager.getRepository(Products);
      const productCategoryRepository = entityManager.getRepository(ProductCategories);
      const productPhotoRepository = entityManager.getRepository(ProductPhotos);

      // Create product
      const product = productRepository.create(productData);
      const savedProduct = await productRepository.save(product);

      // Find/Create Categories
      const categories = await Promise.all(
        catIds.map(async id => {
          let category = await productCategoryRepository.findOne({
            where: { categoryId: id, productId: savedProduct.id },
          });

          if (!category) {
            category = entityManager.create(ProductCategories, {
              categoryId: id,
              productId: savedProduct.id,
            });
            await entityManager.save(category);
          }

          return category;
        }),
      );

      // Create photos
      const photos = medias.map(url =>
        productPhotoRepository.create({
          mediaPath: url,
          productId: savedProduct.id,
        }),
      );

      await productCategoryRepository.save(photos);

      return { ...savedProduct, categories, photos };
    };

    // If manager provided, use it (part of larger transaction)
    if (manager) {
      return executeTransaction(manager);
    }

    // Otherwise create own transaction
    return this.dataSource.manager.transaction(executeTransaction);
  }

  public async updateProduct(id: string, data: UpdateProductDto, manager?: EntityManager): Promise<Products | null> {
    const executeTransaction = async (entityManager: EntityManager) => {
      const productRepository = entityManager.getRepository(Products);
      const productCategoryRepository = entityManager.getRepository(ProductCategories);
      const productPhotoRepository = entityManager.getRepository(ProductPhotos);

      const { photos: medias, categories: catIds, ...productData } = data;

      const product = await productRepository.findOne({
        where: { id },
        relations: ['categories', 'photos'],
      });

      if (!product) {
        throw new Error('Product not found');
      }

      Object.assign(product, productData);

      if (catIds && catIds.length > 0) {
        const existingCategories = new Set(product.categories.map(c => c.categoryId));
        const newCategories = catIds.filter(id => !existingCategories.has(id)); // New ones
        const categoriesToRemove = product.categories.filter(c => !catIds.some(id => id === c.categoryId)); // Old ones

        // Remove only outdated categories
        if (categoriesToRemove.length > 0) {
          await productCategoryRepository.remove(categoriesToRemove);
        }
        // Add only new categories
        if (newCategories.length > 0) {
          const categoryEntities = newCategories.map(catId => productCategoryRepository.create({ categoryId: catId, productId: product.id }));
          await productCategoryRepository.save(categoryEntities);
        }
      }

      if (medias && medias.length > 0) {
        const existingPhotos = new Set(product.photos.map(p => p.mediaPath));
        const newPhotos = medias.filter(p => !existingPhotos.has(p)); // New ones
        const photosToRemove = product.photos.filter(p => !medias.some(np => np === p.mediaPath)); // Old ones

        // Remove only outdated photos
        if (photosToRemove.length > 0) {
          await productPhotoRepository.remove(photosToRemove);
        }

        // Add only new photos
        if (newPhotos.length > 0) {
          const photoEntities = newPhotos.map(media => productPhotoRepository.create({ mediaPath: media, product }));
          await productPhotoRepository.save(photoEntities);
        }
      }

      return productRepository.save(product);
    };
    // If manager provided, use it (part of larger transaction)
    if (manager) {
      return await executeTransaction(manager);
    }

    // Otherwise create own transaction
    return await this.dataSource.manager.transaction(executeTransaction);
  }

  public async getAllProducts(page = 1, limit = 10): Promise<PaginationResponse<Products>> {
    const { skip } = calculatePagination(page, limit);

    const [products, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
    });

    return paginate(products, total, page, limit);
  }

  public async getProductCategories(): Promise<Categories[]> {
    return await this.categoryRepository.find({
      where: {
        categoryType: CategoryType.Product,
      },
    });
  }

  public async getProducts({ page = 1, limit = 20, search = '', business, category }: GetProductsDto) {
    const { skip } = calculatePagination(page, limit);

    const queryConditions: FindManyOptions<Products> = {
      where: {
        status: ProductStatus.Available,
        ...(business && { businessId: business }),
        ...(category && {
          categories: {
            categoryId: category,
          },
        }),
      },
      relations: ['categories', 'photos'],
      skip,
      take: limit,
    };

    if (search) {
      queryConditions.where = [
        {
          ...queryConditions.where,
          name: ILike(`%${search}%`),
        },
        {
          ...queryConditions.where,
          description: ILike(`%${search}%`),
        },
        // { categories: { category: ILike(`%${search}%`) } },
      ];
    }

    const [products, total] = await this.productRepository.findAndCount(queryConditions);

    return paginate(products, total, page, limit);
  }

  public async getRelatedProducts(productId: string, limit = 5) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['categories'],
    });

    if (!product) throw new Error('Product not found');

    const categoryStrings = product.categories.map(cat => cat.categoryId);
    if (!categoryStrings?.length) {
      // throw new Error("Product categories not found");
      return {
        status: 'success',
        data: [],
      };
    }

    // Find related products that share at least one category
    const relatedProducts = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.categories', 'category')
      .where('category.id IN (:...categoryStrings)', { categoryStrings })
      .andWhere('product.id != :productId', { productId }) // Exclude the current product
      .andWhere('product.id = :status', { status: ProductStatus.Available }) // Filter active products
      .take(limit)
      .getMany();

    return {
      status: 'success',
      data: relatedProducts,
    };
  }

  public async getProductById(id: string): Promise<Products | null> {
    return await this.productRepository.findOne({
      where: {
        id,
      },
      relations: {
        categories: true,
        photos: true,
        business: true,
      },
    });
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return result.affected > 0;
  }

  // product photo
  public async addPhoto(data: AddProductPhotoDto) {
    const validatedData = AddProductPhotoSchema.parse(data);
    const { productId, filename } = validatedData;

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new Error('Product not found');

    const productPhoto = this.productPhotoRepository.create({
      product,
      mediaPath: filename,
    });

    return await this.productPhotoRepository.save(productPhoto);
  }

  // product categories
  public async createCategory(data: AddCategoryDto) {
    const { category } = data;

    const existingCategory = await this.categoryRepository.findOne({ where: { category } });
    if (existingCategory) throw new Error('Category already exists');

    const newCategory = this.categoryRepository.create({
      category,
    });

    return await this.categoryRepository.save(newCategory);
  }

  public async deleteCategory(id: string): Promise<boolean> {
    const result = await this.productCategoryRepository.delete(id);
    return result.affected > 0;
  }

  public async addProductCategory(data: AddProductCategoryDto) {
    const product = await this.productRepository.findOne({ where: { id: data.productId }, relations: ['categories'] });
    if (!product) throw new Error('Product not found');

    // Check if the product already has 3 categories
    if (product.categories.length >= 3) throw new Error('Category limit exceeded (max: 3)');

    // Find or create category
    let categoryEntity = await this.productCategoryRepository.findOne({
      where: {
        categoryId: data.category,
        productId: product.id,
      },
    });
    if (!categoryEntity) {
      categoryEntity = this.productCategoryRepository.create({ categoryId: data.category, productId: product.id });
      await this.productCategoryRepository.save(categoryEntity);
    }

    // Add category to product
    // await this.productCategoryRepository.save(product);

    // Return success response
    return {
      id: categoryEntity.id,
      category: categoryEntity.category,
      productString: product.id,
    };
  }

  public async removeProductCategoryAssociation(data: RemoveProductCategoryDto) {
    const validatedData = RemoveProductCategorySchema.parse(data);
    const { productId, categoryId } = validatedData;

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['categories'], // Ensure categories are loaded
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const categoryIndex = product.categories.findIndex(cat => cat.categoryId === categoryId);

    if (categoryIndex === -1) {
      throw new Error('Category is not associated with this product');
    }

    return { message: 'Category removed from product successfully' };
  }

  async removeProductPhoto(data: RemoveProductPhotoDto) {
    const validatedData = RemoveProductPhotoSchema.parse(data);
    const { productId, photoId } = validatedData;

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['photos'],
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const photoIndex = product.photos.findIndex(photo => photo.id.toString() === photoId);

    if (photoIndex === -1) {
      throw new Error('Image not found');
    }

    product.photos.splice(photoIndex, 1);

    await this.productRepository.save(product);

    return { message: 'Photo removed from product successfully' };
  }
}

export { ProductsService };
