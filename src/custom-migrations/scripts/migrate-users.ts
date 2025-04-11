// import { DeepPartial } from 'typeorm';
// import { convertEpochToISO } from '../../core/utils/helpers';
// import { MigrationFactory } from '../migration.factory';
// import { Users } from '../../modules/user/entities/user.entity';
// import { Users as NewUsers } from '../postgres-entities/users.entity';
// import { PostgresDataSource, SqlDataSource } from '../../core/databases';

// const migrateUsers = async () => {
//   // Initialize the migration factory with your old and new data sources
//   const oldDataSource = SqlDataSource; // Replace with your old DB data source
//   const newDataSource = PostgresDataSource; // Replace with your new DB data source

//   const migrationFactory = new MigrationFactory(oldDataSource, newDataSource);

//   // Define the transformation function to map old user data to the new user structure
//   const transformUser = (oldUser: Users): DeepPartial<NewUsers> => {
//     return {
//       verifyString: oldUser.verifyString,
//       name: oldUser.name,
//       email: oldUser.email,
//       password: oldUser.password,
//       image: oldUser.image,
//       referral: oldUser.referMethod,
//       admin: oldUser.admin > 0,
//       createdAt: convertEpochToISO(oldUser.created), // Use the new method here
//       updatedAt: convertEpochToISO(oldUser.lastUpdated),
//       emailVerified: oldUser.confirmedEmail > 0,
//       cv: oldUser.cv,
//       dob: oldUser.dob,
//       phoneNumber: oldUser.phone,
//       gender: oldUser.gender,
//     };
//   };

//   // Migrate users using the migration factory
//   await migrationFactory.migrateEntity(Users, NewUsers, transformUser);
// };

// migrateUsers()
//   .then(() => console.log('User migration completed successfully'))
//   .catch(error => console.error('User migration failed:', error));

import { DeepPartial } from 'typeorm';
import { convertEpochToISO } from '../../core/utils/helpers';
import { MigrationFactory } from '../migration.factory';
import { Users } from '../../modules/user/entities/user.entity';
import { Users as NewUsers } from '../postgres-entities/users.entity';
import { PostgresDataSource, SqlDataSource } from '../../core/databases';

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
        name: oldUser.name,
        email: oldUser.email,
        password: oldUser.password,
        image: oldUser.image,
        referral: oldUser.referMethod,
        admin: oldUser.admin > 0,
        createdAt: convertEpochToISO(oldUser.created), // Use the new method here
        updatedAt: convertEpochToISO(oldUser.lastUpdated),
        emailVerified: oldUser.confirmedEmail > 0,
        cv: oldUser.cv,
        dob: oldUser.dob,
        phoneNumber: oldUser.phone,
        gender: oldUser.gender,
      };
    };

    // Migrate users using the migration factory
    console.log('Starting user migration...');
    await migrationFactory.migrateEntity(Users, NewUsers, transformUser);
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
