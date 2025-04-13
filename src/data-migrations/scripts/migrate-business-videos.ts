import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';

import { convertEpochToISO } from '../../core/utils/helpers';
import { PostgresDataSource, SqlDataSource } from '../connection';

import { Businessvideolinks } from '../../core/database/entities/entities/Businessvideolinks';
import { BusinessVideos } from '../../core/database/postgres/business-videos.entity';
import { Businesses } from '../../core/database/postgres/businesses.entity';

async function migrateBusinessVideos() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformBusinessVideos = async (oldBusinessVideos: Businessvideolinks): Promise<DeepPartial<BusinessVideos>> => {
      const business = await PostgresDataSource.getRepository(Businesses).findOneBy({
        verifyString: oldBusinessVideos.businessString,
      });

      return {
        businessId: business.id,
        mediaPath: oldBusinessVideos.videoLink,
        platform: oldBusinessVideos.platform,
        createdAt: convertEpochToISO(oldBusinessVideos.created),
        updatedAt: convertEpochToISO(oldBusinessVideos.lastUpdated),
      };
    };

    console.log('Starting Businesss Videos migration...');
    await migrationFactory.migrateAllInTransaction(Businessvideolinks, BusinessVideos, tranformBusinessVideos);
    console.log('Business Videos migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateBusinessVideos();
