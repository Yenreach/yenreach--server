import { DeepPartial } from 'typeorm';
import { SqlDataSource, PostgresDataSource } from '../../core/databases';
import { MigrationFactory } from '../migration.factory';
import { States } from '../../entities/entities/States';
import { States as NewStates } from '../../custom-migrations/postgres-entities/states.entity';
import { LocalGovernments } from '../../entities/entities/Localgovernments';
import { LocalGovernments as NewLgas } from '../postgres-entities/local-governments.entity';

const migrateLga = async () => {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformLga = async (oldLga: LocalGovernments): Promise<DeepPartial<NewLgas>> => {
      const state = await PostgresDataSource.getRepository(NewStates).findOneBy({ num_id: oldLga.stateId });
      return {
        num_id: oldLga.id,
        name: oldLga.name,
        stateId: state.id, // Ensure foreign key is correctly assigned
      };
    };

    console.log('Starting LGA migration...');
    await migrationFactory.migrateEntity(LocalGovernments, NewLgas, transformLga);
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
