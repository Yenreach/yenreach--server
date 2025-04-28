import { DeepPartial } from 'typeorm';
import { Jobtags } from '../../core/database/entities/entities/Jobtags';
import { JobTags } from '../../core/database/postgres/job-tags.entity';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { Jobs } from '../../core/database/postgres/jobs.entity';
import { convertEpochToISO } from '../../core/utils/helpers';

async function migrateJobTags() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformJobTags = async (oldJobTags: Jobtags): Promise<DeepPartial<JobTags>> => {
      const job = await PostgresDataSource.getRepository(Jobs).findOneBy({
        jobString: oldJobTags.jobString,
      });

      if (job) {
        return {
          jobId: job.id,
          createdAt: convertEpochToISO(oldJobTags.createdAt),
          updatedAt: convertEpochToISO(oldJobTags.updatedAt),
        };
      }
    };

    console.log('Starting Job Tags migration...');
    await migrationFactory.migrateAllInTransaction(Jobtags, JobTags, transformJobTags);
    console.log('Job Tags migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateJobTags();
