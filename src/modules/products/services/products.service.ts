import { FindManyOptions, ILike } from 'typeorm';
import AppDataSource from '../../../core/database';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { AddCategoryDto, AddProductCategoryDto, AddProductPhotoDto, AddProductPhotoSchema, CreateProductDto, GetProductsDto, RemoveProductCategoryDto, RemoveProductCategorySchema, RemoveProductPhotoDto, RemoveProductPhotoSchema, UpdateProductDto } from '../schemas/products.schema';
import { Products } from '../../../core/database/postgres/product.entity';
import { ProductPhotos } from '../../../core/database/postgres/product-photos.entity';
import { ProductCategories } from '../../../core/database/postgres/product-category.entity';
import { ProductStatus } from '../enums';
import { Categories } from '../../../core/database/postgres/category.entity';
import { CategoryType } from '../../../enums';

class ProductsService {
  private readonly dataSource = AppDataSource;
  private readonly categoryRepository = AppDataSource.getRepository(Categories);
  private readonly productRepository = AppDataSource.getRepository(Products);
  private readonly productCategoryRepository = AppDataSource.getRepository(ProductCategories);
  private readonly productPhotoRepository = AppDataSource.getRepository(ProductPhotos);

  async createProduct(data: CreateProductDto): Promise<any> {
    // const newProduct = this.productRepository.create(data);
    // return await this.productRepository.save(newProduct);

    const { photos: medias, categories: catIds, ...productData } = data;

    // Create product
    const product = this.productRepository.create(productData);

    const savedProduct = await this.productRepository.save(product)

    // Find Category
    const categories = catIds.map(async (id) => {
      let category = await this.productCategoryRepository.findOne({ where: { categoryId: id } });

      if (!category) {
          category = this.productCategoryRepository.create({ categoryId: id, productId: savedProduct.id });
          await this.productCategoryRepository.save(category);
      }

      return category;
    });

    // Create product photos and associate them with the product
    const photos = medias.map((url) => {
      const photo = this.productPhotoRepository.create({
        mediaPath: url,
        productId: savedProduct.id,
      });

      return photo;
    });
    
    await this.productPhotoRepository.save(photos)

    return {
      ...savedProduct,
     categories,
     photos,
    };
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<Products | null> {
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    const { photos: medias, categories: catIds, ...productData } = data;

    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["categories", "photos"],
      // pass the transaction through options here
    });
  
    if (!product) {
      throw new Error("Product not found");
    }
  
    Object.assign(product, productData);

    // Update categories (only existing ones)
    if (catIds && catIds.length > 0) {
      const existingCategories = new Set(product.categories.map((c) => c.categoryId));
      const newCategories = catIds.filter((id) => !existingCategories.has(id)); // New ones
      const categoriesToRemove = product.categories.filter((c) => !catIds.some((id) => id === c.categoryId)); // Old ones

      // Remove only outdated categories
      if (categoriesToRemove.length > 0) {
        await this.productCategoryRepository.remove(categoriesToRemove);
      } 
      // Add only new categories
      if (newCategories.length > 0) {
        const categoryEntities = newCategories.map((catId) =>
          this.productCategoryRepository.create({ categoryId: catId, productId: product.id })
        );
        await this.productCategoryRepository.save(categoryEntities);
      } 
    }

  
    if (medias && medias.length > 0) {
      const existingPhotos = new Set(product.photos.map((p) => p.mediaPath));
      const newPhotos = medias.filter((p) => !existingPhotos.has(p)); // New ones
      const photosToRemove = product.photos.filter((p) => !medias.some((np) => np === p.mediaPath)); // Old ones
  
      // Remove only outdated photos
      if (photosToRemove.length > 0) {
        await this.productPhotoRepository.remove(photosToRemove);
      }
  
      // Add only new photos
      if (newPhotos.length > 0) {
        const photoEntities = newPhotos.map((media) =>
          this.productPhotoRepository.create({ mediaPath: media, product })
        );
        await this.productPhotoRepository.save(photoEntities);
      }
    }
  
    return await this.productRepository.save(product);
  }

  async getAllProducts(page = 1, limit = 10): Promise<PaginationResponse<Products>> {
    const { skip } = calculatePagination(page, limit);

    const [products, total] = await this.productRepository.findAndCount({
      skip,
      take: limit,
    });

    return paginate(products, total, page, limit);
  }

  async getProductCategories(): Promise<Categories[]> {
    return await this.categoryRepository.find({
      where: {
        categoryType: CategoryType.Product,
      },
    });
  }

  async getProducts({ page = 1, limit = 20, search = "", business }: GetProductsDto) {
    const { skip } = calculatePagination(page, limit);

    const queryConditions: FindManyOptions<Products>  = {
      where: {
        status: ProductStatus.Available,
        ...(business && { businessId: business }),
      },
      relations: ["categories", "photos"],
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
    
      // queryConditions.join = {
      //   alias: "product",
      //   leftJoinAndSelect: {
      //     categories: "product.categories",
      //   },
      // };
    }

    const [products, total] = await this.productRepository.findAndCount(queryConditions);

    return paginate(products, total, page, limit);
  }

  async getRelatedProducts(productId: string, limit = 5) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ["categories"],
    });

    if (!product) throw new Error("Product not found");

    const categoryStrings = product.categories.map((cat) => cat.categoryId);
    if (!categoryStrings?.length) { 
      // throw new Error("Product categories not found");
      return {
        status: "success",
        data: [],
      };
    }

    // Find related products that share at least one category
    const relatedProducts = await this.productRepository
      .createQueryBuilder("product")
      .innerJoin("product.categories", "category")
      .where("category.id IN (:...categoryStrings)", { categoryStrings })
      .andWhere("product.id != :productId", { productId }) // Exclude the current product
      .andWhere("product.id = :status", { status: ProductStatus.Available }) // Filter active products
      .take(limit)
      .getMany();

    return {
      status: "success",
      data: relatedProducts,
    };
  }

  async getProductById(id: string): Promise<Products | null> {
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

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return result.affected > 0;
  }

  // product photo
  async addPhoto(data: AddProductPhotoDto) {
    const validatedData = AddProductPhotoSchema.parse(data);
    const { product_string, filename } = validatedData;

    const product = await this.productRepository.findOne({ where: { id: product_string } });
    if (!product) throw new Error("Product not found");

    const productPhoto = this.productPhotoRepository.create({
      product,
      mediaPath: filename,
    });

    return await this.productPhotoRepository.save(productPhoto);
  }

  // product categories
  async createCategory(data: AddCategoryDto) {
    const { category } = data;

    const existingCategory = await this.categoryRepository.findOne({ where: { category } });
    if (existingCategory) throw new Error("Category already exists");

    const newCategory = this.categoryRepository.create({
      category,

    });

    return await this.categoryRepository.save(newCategory);
  }

  
  async deleteCategory(id: string): Promise<boolean> {
    const result = await this.productCategoryRepository.delete(id);
    return result.affected > 0;
  }

  async addProductCategory(data: AddProductCategoryDto) {
    const product = await this.productRepository.findOne({ where: { id: data.productString }, relations: ["categories"] });
    if (!product) throw new Error('Product not found');

    // Check if the product already has 3 categories
    if (product.categories.length >= 3) throw new Error('Category limit exceeded (max: 3)');

    // Find or create category
    let categoryEntity = await this.productCategoryRepository.findOne({ where: {
      categoryId: data.category,
      productId: product.id,
    } });
    if (!categoryEntity) {
        categoryEntity = this.productCategoryRepository.create({ categoryId: data.category, productId: product.id });
        await this.productCategoryRepository.save(categoryEntity);  
    }

    // Add category to product
    // await this.productCategoryRepository.save(product);

    // Return success response
    return ({
        id: categoryEntity.id,
        category: categoryEntity.category,
        productString: product.id,
    })
  };

  async removeProductCategoryAssociation(data: RemoveProductCategoryDto) {
    const validatedData = RemoveProductCategorySchema.parse(data);
    const { product_string, category_string } = validatedData;

    const product = await this.productRepository.findOne({
      where: { id: product_string },
      relations: ["categories"], // Ensure categories are loaded
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const categoryIndex = product.categories.findIndex(
      (cat) => cat.categoryId === category_string
    );

    if (categoryIndex === -1) {
      throw new Error("Category is not associated with this product");
    }

    // product.categories.splice(categoryIndex, 1);

    // await this.productRepository.save(product);

    return { message: "Category removed from product successfully" };
  }

  async removeProductPhoto(data: RemoveProductPhotoDto) {
    const validatedData = RemoveProductPhotoSchema.parse(data);
    const { product_string, photo_string } = validatedData;

    const product = await this.productRepository.findOne({
      where: { id: product_string },
      relations: ["photos"],
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const photoIndex = product.photos.findIndex(
      (photo) => photo.id.toString() === photo_string
    );

    if (photoIndex === -1) {
      throw new Error("Image not found");
    }

    product.photos.splice(photoIndex, 1);

    await this.productRepository.save(product);

    return { message: "Photo removed from product successfully" };
  }
}

export { ProductsService };
