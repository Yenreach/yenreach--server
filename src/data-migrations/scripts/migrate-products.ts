import { DeepPartial } from 'typeorm';
import { Products as OldProducts } from '../../core/database/entities/entities/Products';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { Products } from '../../core/database/postgres/product.entity';
import { Businesses } from '../../core/database/postgres/businesses.entity';
import { convertEpochToISO } from '../../core/utils/helpers';
import { ProductStatus } from '../../modules/products/enums';

async function migrateProducts() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformProducts = async (oldProuct: OldProducts): Promise<DeepPartial<Products>> => {
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
