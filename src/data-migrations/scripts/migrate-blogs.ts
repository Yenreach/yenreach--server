import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';

async function migrateBlogs() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    // const tranformBlogs = async (oldBlogs: Blogpost): Promise<DeepPartial<Blogs>> => {};

    console.log('Starting Blogs migration...');

    console.log('Blogs migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateBlogs();
