import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';
import { Businesses } from '../postgres-entities/businesses.entity';
import { convertEpochToISO } from '../../core/utils/helpers';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { Businessphotos } from '../../core/database/entities/entities/Businessphotos';
import { BusinessPhotos } from '../../core/database/postgres/business-photos.entity';

async function migrateBusinessPhotos() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformBusinessPhotos = async (oldBusinessPhotos: Businessphotos): Promise<DeepPartial<BusinessPhotos>> => {
      const business = await PostgresDataSource.getRepository(Businesses).findOneBy({
        verifyString: oldBusinessPhotos.businessString,
      });

      return {
        businessId: business.id,
        mediaPath: oldBusinessPhotos.filepath,
        createdAt: convertEpochToISO(oldBusinessPhotos.created),
        updatedAt: convertEpochToISO(oldBusinessPhotos.lastUpdated),
      };
    };

    console.log('Starting Businesss Photos migration...');
    await migrationFactory.migrateAllInTransaction(Businessphotos, BusinessPhotos, tranformBusinessPhotos);
    console.log('Business Photos migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateBusinessPhotos();
