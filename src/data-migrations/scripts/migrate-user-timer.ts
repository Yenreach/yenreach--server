import { DeepPartial } from 'typeorm';
import { convertEpochToISO } from '../../core/utils/helpers';
import { MigrationFactory } from '../migration.factory';
import { Users } from '../../core/database/entities/entities/Users';
import { Users as NewUsers } from '../../core/database/postgres/users.entity';
import { PostgresDataSource, SqlDataSource } from '../connection';

const migrateUsersTimers = async () => {
  try {
    // Initialize connections to both databases
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    // Initialize the migration factory with your old and new data sources
    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    //Migrating timer data
    console.log('Starting timer migration...');
    await migrationFactory.updateAllInTransaction(Users, NewUsers, 'verifyString', old => ({
      timer: old.timer,
    }));
    console.log('User timer migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the database connections when done
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
};

migrateUsersTimers();
