import { DeepPartial } from 'typeorm';
import { Productphotos } from '../../core/database/entities/entities/Productphotos';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { ProductPhotos } from '../../core/database/postgres/product-photos.entity';
import { Products } from '../../core/database/postgres/product.entity';
import { convertEpochToISO } from '../../core/utils/helpers';

async function migrateProductsPhotos() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformProductsPhotos = async (oldProductPhotos: Productphotos): Promise<DeepPartial<ProductPhotos>> => {
      const product = await PostgresDataSource.getRepository(Products).findOneBy({
        productString: oldProductPhotos.productString,
      });

      return {
        productId: product.id,
        mediaPath: oldProductPhotos.filename,
        createdAt: convertEpochToISO(oldProductPhotos.createdAt),
        updatedAt: convertEpochToISO(oldProductPhotos.updatedAt),
      };
    };

    console.log('Starting Product Photos migration...');
    await migrationFactory.migrateAllInTransaction(Productphotos, ProductPhotos, tranformProductsPhotos);
    console.log('Product Photos migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateProductsPhotos();
