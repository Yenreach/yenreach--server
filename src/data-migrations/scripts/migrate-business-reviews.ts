import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';
import { convertEpochToISO } from '../../core/utils/helpers';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { Businessreviews } from '../../core/database/entities/entities/Businessreviews';
import { BusinessReviews } from '../../core/database/postgres/business-reviews.entity';
import { Users } from '../../core/database/postgres/users.entity';
import { Businesses } from '../../core/database/postgres/businesses.entity';

async function migrateBusinessReviews() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformBusinessReviews = async (oldBusinessReviews: Businessreviews): Promise<DeepPartial<BusinessReviews>> => {
      const [business, user] = await Promise.all([
        PostgresDataSource.getRepository(Businesses).findOneBy({
          verifyString: oldBusinessReviews.businessString,
        }),
        PostgresDataSource.getRepository(Users).findOneBy({
          verifyString: oldBusinessReviews.userString,
        }),
      ]);

      if (business && user) {
        return {
          businessId: business.id,
          userId: user.id,
          review: oldBusinessReviews.review,
          star: oldBusinessReviews.star,
          createdAt: convertEpochToISO(oldBusinessReviews.created),
          updatedAt: convertEpochToISO(oldBusinessReviews.lastUpdated),
        };
      }
      return null;
    };

    console.log('Starting Businesss Review migration...');
    await migrationFactory.migrateAllInTransaction(Businessreviews, BusinessReviews, tranformBusinessReviews);
    console.log('Business Reviews migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateBusinessReviews();
