import { DeepPartial } from 'typeorm';

import { MigrationFactory } from '../migration.factory';
import { Sections } from '../../core/database/entities/entities/Sections';

import { PostgresDataSource, SqlDataSource } from '../connection';
import { Categories } from '../../core/database/postgres/category.entity';
import { CategoryType } from '../../enums';

const migrateSections = async () => {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformSections = async (oldSections: Sections): Promise<DeepPartial<Categories>> => {
      return {
        verifyString: oldSections.verifyString,
        category: oldSections.section,
        categoryType: CategoryType.Business,
      };
    };

    console.log('Starting sections to category migration...');
    await migrationFactory.migrateAllInTransaction(Sections, Categories, transformSections);
    console.log('Sections migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
};

migrateSections();
