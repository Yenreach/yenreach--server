import { DeepPartial } from 'typeorm';
import { Productcategories } from '../../core/database/entities/entities/Productcategories';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { ProductCategories } from '../../core/database/postgres/product-category.entity';
import { Products } from '../../core/database/postgres/product.entity';
import { Categories } from '../../core/database/postgres/category.entity';
import { CategoryType } from '../../enums';
import { convertEpochToISO } from '../../core/utils/helpers';

async function migrateProductsCategories() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformProductsCategories = async (oldProductCategory: Productcategories): Promise<DeepPartial<ProductCategories>> => {
      const [product, category] = await Promise.all([
        PostgresDataSource.getRepository(Products).findOneBy({
          productString: oldProductCategory.productString,
        }),
        PostgresDataSource.getRepository(Categories).findOneBy({
          verifyString: oldProductCategory.categoryString,
          categoryType: CategoryType.Product,
        }),
      ]);

      return {
        productId: product.id,
        categoryId: category.id,
        createdAt: convertEpochToISO(oldProductCategory.createdAt),
        updatedAt: convertEpochToISO(oldProductCategory.updatedAt),
      };
    };

    console.log('Starting Product Categories migration...');
    await migrationFactory.migrateAllInTransaction(Productcategories, ProductCategories, tranformProductsCategories);
    console.log('Products Categories migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateProductsCategories();
