import { DataSource, getManager, Like } from 'typeorm';
import AppDataSource from '../../../core/databases';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { ProductCategory } from '../entities/product-categories.entity';
import { ProductPhoto } from '../entities/product-photos.entity';
import { Products } from '../entities/products.entity';
import { AddCategoryDto, AddProductCategoryDto, AddProductPhotoDto, AddProductPhotoSchema, CreateProductDto, GetProductsDto, RemoveProductCategoryDto, RemoveProductCategorySchema, RemoveProductPhotoDto, RemoveProductPhotoSchema, UpdateProductDto } from '../schemas/products.schema';

class ProductsService {
  constructor(
    private dataSource: DataSource // Inject the DataSource instance
  ) {}

  private readonly productRepository = AppDataSource.getRepository(Products);
  private readonly productCategoryRepository = AppDataSource.getRepository(ProductCategory);
  private readonly productPhotoRepository = AppDataSource.getRepository(ProductPhoto);

  async createProduct(data: CreateProductDto): Promise<any> {
    // const newProduct = this.productRepository.create(data);
    // return await this.productRepository.save(newProduct);

    // Create or find categories
    const categories = await Promise.all(
        data.categories.map(async (data) => {
            let category = await this.productCategoryRepository.findOne({ where: { category: data.category } });

            if (!category) {
                category = this.productCategoryRepository.create({ category: data.category });
                await this.productCategoryRepository.save(category);
            }

            return category;
        })
    );

    // Create product
    const product = this.productRepository.create({
      productName: data.name,
      categories,
    });

    const savedProduct = await this.productRepository.save(product)

    // Create product photos and associate them with the product
    const photos = data.photos.map((data) => {
      const photo = this.productPhotoRepository.create({
        filename: data.filename,
        product: savedProduct,
      });

      return photo;
    });
    
    await this.productPhotoRepository.save(photos)

    return savedProduct;
  }

  async updateProduct(id: number, data: UpdateProductDto): Promise<Products | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["categories", "photos"],
      // pass the transaction through options here
    });
  
    if (!product) {
      throw new Error("Product not found");
    }
  
    Object.assign(product, data);

    // Update categories (only existing ones)
    if (data.categories) {
      const existingCategories = await this.productCategoryRepository.find({
        where: data.categories.map((c) => ({ category: c.category })),
      });
      product.categories = existingCategories;
    }
  
    if (data.photos) {
      const existingPhotos = new Set(product.photos.map((p) => p.filename));
      const newPhotos = data.photos.filter((p) => !existingPhotos.has(p.filename)); // New ones
      const photosToRemove = product.photos.filter((p) => !data.photos.some((np) => np.filename === p.filename)); // Old ones
  
      // Remove only outdated photos
      if (photosToRemove.length > 0) {
        await this.productPhotoRepository.remove(photosToRemove);
      }
  
      // Add only new photos
      if (newPhotos.length > 0) {
        const photoEntities = newPhotos.map((p) =>
          this.productPhotoRepository.create({ filename: p.filename, product })
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

  async getProducts({ skip = 0, per_page = 20, search = "", business }: GetProductsDto) {
    const queryConditions: any = {
      where: {
        product_status: "active",
        ...(business && { businessString: business }),
      },
      relations: ["categories", "photos"],
      skip,
      take: per_page,
    };

    if (search) {
      queryConditions.where = [
        {
          ...queryConditions.where,
          productName: Like(`%${search}%`),
        },
        { categories: { category: Like(`%${search}%`) } },
      ];
    
      queryConditions.join = {
        alias: "product",
        leftJoinAndSelect: {
          categories: "product.categories",
        },
      };
    }

    const [products, total] = await this.productRepository.findAndCount(queryConditions);

    return {
      status: "success",
      total,
      data: products,
      page: skip+1,
      perPage: per_page
    };
  }

  async getRelatedProducts(productId: string, limit = 5) {
    const product = await this.productRepository.findOne({
      where: { verifyString: productId },
      relations: ["categories"],
    });

    if (!product) throw new Error("Product not found");

    const categoryStrings = product.categories.map((cat) => cat.category_string);

    // Find related products that share at least one category
    const relatedProducts = await this.productRepository
      .createQueryBuilder("product")
      .innerJoin("product.categories", "category")
      .where("category.category_string IN (:...categoryStrings)", { categoryStrings })
      .andWhere("product.product_string != :productId", { productId }) // Exclude the current product
      .andWhere("product.product_status = :status", { status: "active" }) // Filter active products
      .take(limit)
      .getMany();

    return {
      status: "success",
      data: relatedProducts,
    };
  }

  async getProductById(id: number): Promise<Products | null> {
    return await this.productRepository.findOneBy({ id });
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return result.affected > 0;
  }

  // product photo
  async addPhoto(data: AddProductPhotoDto) {
    const validatedData = AddProductPhotoSchema.parse(data);
    const { product_string, filename } = validatedData;

    const product = await this.productRepository.findOne({ where: { verifyString: product_string } });
    if (!product) throw new Error("Product not found");

    const productPhoto = this.productPhotoRepository.create({
      product,
      filename,
    });

    return await this.productPhotoRepository.save(productPhoto);
  }

  // product categories
  async createCategory(data: AddCategoryDto) {
    const { category, details } = data;

    const existingCategory = await this.productCategoryRepository.findOne({ where: { category } });
    if (existingCategory) throw new Error("Category already exists");

    const newCategory = this.productCategoryRepository.create({
      category,
      details,
    });

    return await this.productCategoryRepository.save(newCategory);
  }

  
  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.productCategoryRepository.delete(id);
    return result.affected > 0;
  }

  async addProductCategory(data: AddProductCategoryDto) {
    const product = await this.productRepository.findOne({ where: { verifyString: data.productString }, relations: ["categories"] });
    if (!product) throw new Error('Product not found');

    // Check if the product already has 3 categories
    if (product.categories.length >= 3) throw new Error('Category limit exceeded (max: 3)');

    // Find or create category
    let categoryEntity = await this.productCategoryRepository.findOne({ where: { category: data.category } });
    if (!categoryEntity) {
        categoryEntity = this.productCategoryRepository.create({ category: data.category });
        await this.productCategoryRepository.save(categoryEntity);
    }

    // Add category to product
    product.categories.push(categoryEntity);
    await this.productCategoryRepository.save(product);

    // Return success response
    return ({
        id: categoryEntity.id,
        category: categoryEntity.category,
        productString: product.verifyString,
    })
  };

  async removeProductCategoryAssociation(data: RemoveProductCategoryDto) {
    const validatedData = RemoveProductCategorySchema.parse(data);
    const { product_string, category_string } = validatedData;

    const product = await this.productRepository.findOne({
      where: { verifyString: product_string },
      relations: ["categories"], // Ensure categories are loaded
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const categoryIndex = product.categories.findIndex(
      (cat) => cat.category_string === category_string
    );

    if (categoryIndex === -1) {
      throw new Error("Category is not associated with this product");
    }

    product.categories.splice(categoryIndex, 1);

    await this.productRepository.save(product);

    return { message: "Category removed from product successfully" };
  }

  async removeProductPhoto(data: RemoveProductPhotoDto) {
    const validatedData = RemoveProductPhotoSchema.parse(data);
    const { product_string, photo_string } = validatedData;

    const product = await this.productRepository.findOne({
      where: { verifyString: product_string },
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

export { ProductsService }
