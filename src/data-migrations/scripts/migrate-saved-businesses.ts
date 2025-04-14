import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';

import { Savedbusinesses as OldSavedBusinesses } from '../../core/database/entities/entities/Savedbusinesses';

import { PostgresDataSource, SqlDataSource } from '../connection';
import { SavedBusinesses } from '../../core/database/postgres/saved-business.entity';
import { Users } from '../../core/database/postgres/users.entity';
import { Businesses } from '../../core/database/postgres/businesses.entity';

async function migrateSavedBusiness() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformSavedBusinesses = async (oldSavedBusinesses: OldSavedBusinesses): Promise<DeepPartial<SavedBusinesses>> => {
      const [user, business] = await Promise.all([
        PostgresDataSource.getRepository(Users).findOneBy({
          verifyString: oldSavedBusinesses.businessString,
        }),
        PostgresDataSource.getRepository(Businesses).findOneBy({
          verifyString: oldSavedBusinesses.businessString,
        }),
      ]);

      return {
        businessId: business.id,
        userId: user.id,
      };
    };

    console.log('Starting Saved Businesss migrations...');
    await migrationFactory.migrateAllInTransaction(OldSavedBusinesses, SavedBusinesses, tranformSavedBusinesses);
    console.log('Saved Business Categories migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateSavedBusiness();
