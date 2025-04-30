import { DeepPartial } from 'typeorm';
import { Businessworkinghours } from '../../core/database/entities/entities/Businessworkinghours';
import { BusinessWorkingHours } from '../../core/database/postgres/business-working-hours.entity';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { Businesses } from '../../core/database/postgres/businesses.entity';

async function migrateBusinessWorkingHours() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformBusinessWorkingHours = async (oldBusinessWorkingHourse: Businessworkinghours): Promise<DeepPartial<BusinessWorkingHours>> => {
      const business = await PostgresDataSource.getRepository(Businesses).findOneBy({
        verifyString: oldBusinessWorkingHourse.businessString,
      });

      if (business) {
        return {
          businessId: business.id,
          days: oldBusinessWorkingHourse.day,
          openingTime: oldBusinessWorkingHourse.openingTime,
          closingTime: oldBusinessWorkingHourse.closingTime,
        };
      }
      return null;
    };

    console.log('Starting Businesss Working Hours migration...');
    await migrationFactory.migrateAllInTransaction(Businessworkinghours, BusinessWorkingHours, tranformBusinessWorkingHours);
    console.log('Business Working Hourse migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateBusinessWorkingHours();
