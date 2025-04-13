import { DeepPartial } from 'typeorm';
import { Businesscategories } from '../../modules/business/entities/business-categories.entity';
import { MigrationFactory } from '../migration.factory';
import { BusinessCategories } from '../postgres-entities/business-categories.entity';
import { Businesses } from '../postgres-entities/businesses.entity';
import { Categories } from '../postgres-entities/category.entity';
import { convertEpochToISO } from '../../core/utils/helpers';
import { PostgresDataSource, SqlDataSource } from '../connection';

async function migrateBusinessCategories() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformCategories = async (oldBusinessCategories: Businesscategories): Promise<DeepPartial<BusinessCategories>> => {
      const [business, category] = await Promise.all([
        PostgresDataSource.getRepository(Businesses).findOneBy({
          verifyString: oldBusinessCategories.businessString,
        }),
        PostgresDataSource.getRepository(Categories).findOneBy({
          verifyString: oldBusinessCategories.categoryString,
        }),
      ]);

      return {
        businessId: business.id,
        categoryId: category.id,
        createdAt: convertEpochToISO(oldBusinessCategories.created),
        updatedAt: convertEpochToISO(oldBusinessCategories.lastUpdated),
      };
    };

    console.log('Starting Businesss Categories migration...');
    await migrationFactory.migrateAllInTransaction(Businesscategories, BusinessCategories, tranformCategories);
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
