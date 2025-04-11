import { DeepPartial } from 'typeorm';
import { PostgresDataSource, SqlDataSource } from '../../core/databases';
import { Blogpost } from '../../entities/entities/Blogpost';
import { MigrationFactory } from '../migration.factory';
import { Blogs } from '../postgres-entities/blogs.entity';

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

    console.log('Business migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}
