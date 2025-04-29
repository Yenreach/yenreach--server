import { DeepPartial } from 'typeorm';
import { Jobs as OldJobs } from '../../core/database/entities/entities/Jobs';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { Jobs } from '../../core/database/postgres/jobs.entity';
import { Businesses } from '../../core/database/postgres/businesses.entity';
import { convertEpochToISO } from '../../core/utils/helpers';
import { JobStatus } from '../../modules/jobs/enums';

async function migrateJobs() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformJobs = async (oldJobs: OldJobs): Promise<DeepPartial<Jobs>> => {
      if (!oldJobs.adminJob) {
        const business = await PostgresDataSource.getRepository(Businesses).findOneBy({
          verifyString: oldJobs.businessString,
        });

        return {
          jobString: oldJobs.jobString,
          businessId: business.id,
          title: oldJobs.jobTitle,
          location: oldJobs.location,
          isAdminJob: false,
          adminId: null,
          companyName: oldJobs.companyName,
          description: oldJobs.jobOverview,
          benefit: oldJobs.jobBenefit,
          type: oldJobs.jobType,
          applicationMethod: oldJobs.jobLink,
          salary: oldJobs.salary,
          applicationExpiry: oldJobs.expiryDate,
          status: oldJobs.status ? JobStatus.Open : JobStatus.Closed,
          createdAt: convertEpochToISO(oldJobs.createdAt),
          updatedAt: convertEpochToISO(oldJobs.updatedAt),
        };
      }
    };

    console.log('Starting Jobs migration...');
    await migrationFactory.migrateAllInTransaction(OldJobs, Jobs, transformJobs);
    console.log('Jobs migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateJobs();
