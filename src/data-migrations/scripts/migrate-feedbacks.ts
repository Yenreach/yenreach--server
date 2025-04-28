import { DeepPartial } from 'typeorm';
import { Feedback } from '../../core/database/entities/entities/Feedback';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { MigrationFactory } from '../migration.factory';
import { Feedbacks } from '../../core/database/postgres/feedback.entity';
import { convertEpochToISO } from '../../core/utils/helpers';
import { FeedbackStatus } from '../../enums';

async function migrateFeedbacks() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const tranformFeedbacks = async (oldFeedbacks: Feedback): Promise<DeepPartial<Feedbacks>> => {
      return {
        name: oldFeedbacks.name,
        subject: oldFeedbacks.subject,
        email: oldFeedbacks.email,
        createdAt: convertEpochToISO(oldFeedbacks.createdAt),
        updatedAt: convertEpochToISO(oldFeedbacks.updatedAt),
        status: oldFeedbacks.status > 0 ? FeedbackStatus.Acknowledged : FeedbackStatus.Pending,
      };
    };

    console.log('Starting Feedbacks migration...');
    await migrationFactory.migrateAllInTransaction(Feedback, Feedbacks, tranformFeedbacks);
    console.log('Feedbacks migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    console.log('Closing database connection');
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
}

migrateFeedbacks();
