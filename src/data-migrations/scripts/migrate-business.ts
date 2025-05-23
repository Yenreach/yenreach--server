import { DeepPartial } from 'typeorm';
import { MigrationFactory } from '../migration.factory';
import { Businesses as OldBusiness } from '../../core/database/entities/entities/Businesses';
import { convertEpochToISO } from '../../core/utils/helpers';
import { BusinessRegistrationState } from '../../modules/business/enums/business.enums';
import { PostgresDataSource, SqlDataSource } from '../connection';
import { Businesses } from '../../core/database/postgres/businesses.entity';
import { Users } from '../../core/database/postgres/users.entity';
import { States } from '../../core/database/postgres/states.entity';
import { LocalGovernments } from '../../core/database/postgres/local-governments.entity';

async function migrateBusiness() {
  try {
    console.log('Initializing SQL data source...');
    await SqlDataSource.initialize();
    console.log('SQL data source initialized successfully');

    console.log('Initializing PostgreSQL data source...');
    await PostgresDataSource.initialize();
    console.log('PostgreSQL data source initialized successfully');

    const migrationFactory = new MigrationFactory(SqlDataSource, PostgresDataSource);

    const transformBusiness = async (oldBusinesses: OldBusiness): Promise<DeepPartial<Businesses>> => {
      const [user, state, lga] = await Promise.all([
        PostgresDataSource.getRepository(Users).findOneBy({ verifyString: oldBusinesses.userString }),
        PostgresDataSource.getRepository(States).findOneBy({ name: oldBusinesses.state }),
        PostgresDataSource.getRepository(LocalGovernments).findOneBy({ name: oldBusinesses.lga }),
      ]);

      let registrationStatus: BusinessRegistrationState | undefined;

      if (oldBusinesses.regStage < 3) {
        registrationStatus = BusinessRegistrationState.INCOMPLETE;
      } else if (oldBusinesses.regStage === 3) {
        registrationStatus = BusinessRegistrationState.PENDING;
      } else if (oldBusinesses.regStage === 4) {
        registrationStatus = BusinessRegistrationState.APPROVED;
      }

      if (user && state && lga) {
        return {
          verifyString: oldBusinesses.verifyString,
          userString: oldBusinesses.userString,
          subscriptionString: oldBusinesses.subscriptionString,
          website: oldBusinesses.website,
          twitterLink: oldBusinesses.twitterLink,
          instagramLink: oldBusinesses.instagramLink,
          whatsapp: oldBusinesses.whatsapp,
          facebookLink: oldBusinesses.facebookLink,
          town: oldBusinesses.town,
          userId: user ? user.id : null,
          stateId: state ? state.id : null,
          lgaId: lga ? lga.id : null,
          registrationStatus,
          createdAt: convertEpochToISO(oldBusinesses.created),
          updatedAt: convertEpochToISO(oldBusinesses.lastUpdated),
          experience: oldBusinesses.experience,
          email: oldBusinesses.email,
          description: oldBusinesses.description,
          cv: oldBusinesses.cv,
          coverImg: oldBusinesses.coverImg,
          isActive: oldBusinesses.activation > 0,
          profileImg: oldBusinesses.profileImg,
          phoneNumber: oldBusinesses.phonenumber,
          monthStarted: oldBusinesses.monthStarted,
          yearStarted: oldBusinesses.yearStarted,
          youtubeLink: oldBusinesses.youtubeLink,
          linkedinLink: oldBusinesses.linkedinLink,
          address: oldBusinesses.address,
          name: oldBusinesses.name,
        };
      }

      return null;
    };

    console.log('Starting Business migration...');
    await migrationFactory.migrateAllInTransaction(OldBusiness, Businesses, transformBusiness);
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

migrateBusiness();
