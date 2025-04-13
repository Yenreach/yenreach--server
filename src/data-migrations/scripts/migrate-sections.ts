import { DeepPartial } from 'typeorm';
import { SqlDataSource, PostgresDataSource } from '../../core/database';
import { MigrationFactory } from '../migration.factory';
import { Sections } from '../../core/database/entities/entities/Sections';
import { Categories } from '../postgres-entities/category.entity';

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
      //   const state = await PostgresDataSource.getRepository(NewStates).findOneBy({ num_id: oldLga.stateId });
      return {
        verifyString: oldSections.verifyString,
        category: oldSections.section,
      };
    };

    console.log('Starting sections to category migration...');
    await migrationFactory.migrateEntity(Sections, Categories, transformSections);
    console.log('LGA migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
};

migrateSections();
