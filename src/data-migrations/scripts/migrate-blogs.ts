import { DeepPartial } from 'typeorm';
import { Blogs } from '../../core/database/postgres/blogs.entity';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { Blogpost } from '../../core/database/entities/entities/Blogpost';
import { convertEpochToISO } from '../../core/utils/helpers';

async function migrateBlogs() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformBlogs = async (oldBlogs: Blogpost): Promise<DeepPartial<Blogs>> => {
      return {
        authorId: 'a70e324c-d1bd-4eec-b539-d51aba4a167b',
        title: oldBlogs.title,
        content: oldBlogs.post,
        preview: oldBlogs.snippet,
        mediaUrl: oldBlogs.filePath,
        isFeatured: false,
        createdAt: convertEpochToISO(oldBlogs.createdAt),
        updatedAt: convertEpochToISO(oldBlogs.updatedAt),
      };
    };

    console.log('Starting Blogs migration...');

    await migrationFactory.migrateAllInTransaction(Blogpost, Blogs, tranformBlogs);

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
