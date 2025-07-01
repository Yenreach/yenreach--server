import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';
import { States } from '../../core/database/entities/entities/States';
import { States as NewStates } from '../../core/database/postgres/states.entity';
import { PostgresDataSource, SqlDataSource } from '../connection';

const migrateStates = async () => {
  try {
    // Initialize connections to both databases
    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    // Initialize the migration factory with your old and new data sources
    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    // Define the transformation function to map old user data to the new user structure
    const transformState = (oldState: States): DeepPartial<NewStates> => {
      return {
        numId: oldState.id,
        name: oldState.name,
      };
    };

    // Migrate users using the migration factory
    console.log('Starting state migration...');
    await migrationFactory.migrateAllInTransaction(States, NewStates, transformState);
    console.log('State migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the database connections when done
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
};

migrateStates();
