import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';
import { LocalGovernments } from '../../core/database/entities/entities/Localgovernments';
import { LocalGovernments as NewLgas } from '../../core/database/postgres/local-governments.entity';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { States } from '../../core/database/postgres/states.entity';

const migrateLga = async () => {
  try {
    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformLga = async (oldLga: LocalGovernments): Promise<DeepPartial<NewLgas>> => {
      const state = await PostgresDataSource.getRepository(States).findOneBy({ numId: oldLga.stateId });
      return {
        num_id: oldLga.id,
        name: oldLga.name,
        stateId: state.id, // Ensure foreign key is correctly assigned
      };
    };

    console.log('Starting LGA migration...');
    await migrationFactory.migrateAllInTransaction(LocalGovernments, NewLgas, transformLga);
    console.log('LGA migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
};

migrateLga();
