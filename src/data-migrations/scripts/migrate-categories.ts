import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';
import { Categories as OldCategories } from '../../core/database/entities/entities/Categories';
import { Categories } from '../postgres-entities/category.entity';
import { CategoryType } from '../../enums';
import { Productcategorylist } from '../../core/database/entities/entities/Productcategorylist';
import { PostgresDataSource, SqlDataSource } from '../connection';

const migrateCategories = async () => {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformBusinessCategories = async (oldCategories: OldCategories): Promise<DeepPartial<Categories>> => {
      const category = await PostgresDataSource.getRepository(Categories).findOneBy({ verifyString: oldCategories.sectionString });
      return {
        categoryType: CategoryType.Business,
        verifyString: oldCategories.verifyString,
        category: oldCategories.category,
        parentCategoryId: category.id,
      };
    };

    const transformProductCategories = async (oldCategories: Productcategorylist): Promise<DeepPartial<Categories>> => {
      return {
        categoryType: CategoryType.Product,
        verifyString: oldCategories.categoryString,
        category: oldCategories.category,
        parentCategoryId: null,
      };
    };

    console.log('Starting category to category migration for business...');
    await migrationFactory.migrateAllInTransaction(OldCategories, Categories, transformBusinessCategories);
    console.log('Category migration completed successfully');

    console.log('Starting category to category migration for products...');
    await migrationFactory.migrateAllInTransaction(Productcategorylist, Categories, transformProductCategories);
    console.log('Category migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
};

migrateCategories();
