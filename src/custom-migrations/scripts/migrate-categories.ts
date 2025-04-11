import { DeepPartial } from 'typeorm';
import { SqlDataSource, PostgresDataSource } from '../../core/databases';
import { MigrationFactory } from '../migration.factory';
import { Categories as OldCategories } from '../../entities/entities/Categories';
import { Categories } from '../postgres-entities/category.entity';

const migrateCategories = async () => {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformCategories = async (oldCategories: OldCategories): Promise<DeepPartial<Categories>> => {
      const category = await PostgresDataSource.getRepository(Categories).findOneBy({ verifyString: oldCategories.sectionString });
      return {
        verifyString: oldCategories.verifyString,
        category: oldCategories.category,
        parentCategoryId: category.id,
      };
    };

    console.log('Starting category to category migration...');
    await migrationFactory.migrateAllInTransaction(OldCategories, Categories, transformCategories);
    console.log('Category migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
};

migrateCategories();
