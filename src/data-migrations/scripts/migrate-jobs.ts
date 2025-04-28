import { DeepPartial } from 'typeorm';
import { Jobs as OldJobs } from '../../core/database/entities/entities/Jobs';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { Jobs } from '../../core/database/postgres/jobs.entity';

async function migrateJobs() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformProducts = async (oldJobs: OldJobs): Promise<DeepPartial<Jobs>> => {
      const business = await PostgresDataSource.getRepository(Businesses).findOneBy({
        verifyString: oldProuct.businessString,
      });

      return {
        productString: oldProuct.productString,
        businessId: business.id,
        color: oldProuct.productColor,
        safetyTip: oldProuct.productSafetyTip,
        name: oldProuct.productName,
        description: oldProuct.productDescription,
        price: oldProuct.productPrice,
        quantity: oldProuct.productQuantity,
        status: oldProuct.productStatus ? ProductStatus.Available : ProductStatus.OutOfStock,
        createdAt: convertEpochToISO(oldProuct.createdAt),
        updatedAt: convertEpochToISO(oldProuct.updatedAt),
      };
    };

    console.log('Starting Products migration...');
    await migrationFactory.migrateAllInTransaction(OldProducts, Products, transformProducts);
    console.log('Products migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateProducts();
