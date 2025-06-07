import { DeepPartial } from 'typeorm';
import { convertEpochToISO } from '../../core/utils/helpers';
import { MigrationFactory } from '../migration.factory';
import { Users } from '../../core/database/entities/entities/Users';
import { Users as NewUsers } from '../../core/database/postgres/users.entity';
import { PostgresDataSource, SqlDataSource } from '../connection';

const migrateUsers = async () => {
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

    // Define the transformation function to map old user data to the new user structure
    const transformUser = (oldUser: Users): DeepPartial<NewUsers> => {
      return {
        verifyString: oldUser.verifyString,
        timer: oldUser.timer,
        name: oldUser.name,
        email: oldUser.email,
        password: oldUser.password,
        profileImage: oldUser.image ? oldUser.image : null,
        referral: oldUser.referMethod ? oldUser.referMethod : null,
        createdAt: convertEpochToISO(oldUser.created),
        updatedAt: convertEpochToISO(oldUser.lastUpdated),
        emailVerified: oldUser.confirmedEmail > 0,
        cv: oldUser.cv ? oldUser.cv : null,
        dob: oldUser.dob ? oldUser.dob : null,
        phoneNumber: oldUser.phone ? oldUser.phone : null,
        gender: oldUser.gender ? oldUser.gender : null,
      };
    };

    // Migrate users using the migration factory
    console.log('Starting user migration...');
    await migrationFactory.migrateAllInTransaction(Users, NewUsers, transformUser);
    console.log('User migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the database connections when done
    await SqlDataSource.destroy();
    await PostgresDataSource.destroy();
    console.log('Database connections closed');
  }
};

migrateUsers();
