import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';
import { convertEpochToISO } from '../../core/utils/helpers';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { Businesscategories } from '../../core/database/entities/entities/Businesscategories';
import { Businesses } from '../../core/database/postgres/businesses.entity';
import { Categories } from '../../core/database/postgres/category.entity';
import { BusinessCategories } from '../../core/database/postgres/business-categories.entity';

async function migrateBusinessCategories() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformBusinessCategories = async (oldBusinessCategories: Businesscategories): Promise<DeepPartial<BusinessCategories>> => {
      const [business, category] = await Promise.all([
        PostgresDataSource.getRepository(Businesses).findOneBy({
          verifyString: oldBusinessCategories.businessString,
        }),
        PostgresDataSource.getRepository(Categories).findOneBy({
          verifyString: oldBusinessCategories.categoryString,
        }),
      ]);

      if (business && category) {
        return {
          businessId: business.id,
          categoryId: category.id,
          createdAt: convertEpochToISO(oldBusinessCategories.created),
          updatedAt: convertEpochToISO(oldBusinessCategories.lastUpdated),
        };
      }

      return null;
    };

    console.log('Starting Businesss Categories migration...');
    await migrationFactory.migrateAllInTransaction(Businesscategories, BusinessCategories, tranformBusinessCategories);
    console.log('Business Categories migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateBusinessCategories();
