// import { DataSource } from 'typeorm';
// import { Users } from '../../modules/user/entities/user.entity';
// import { Products } from '../../modules/products/entities/products.entity';
// import { Businesses } from '../../modules/business/entities/businesses.entity';

// export const AppDataSource = new DataSource({
//   type: 'sqlite',
//   // type: 'mysql',
//   // host: 'localhost',
//   // port: 3306,
//   // username: 'yenreach',
//   // password: 'password',
//   database: 'yenreach',
//   synchronize: true, // Use with caution in production
//   logging: false,
//   entities: [
//     // Users,
//     // Products,
//     // Add other entities explicitly here if needed
//     Businesses,
//   ],
//   migrations: ["src/migrations/*.ts"],
//   subscribers: [],
// });

// export default AppDataSource;

import { DataSource } from 'typeorm';
import { Users } from '../../modules/user/entities/user.entity';
import { Users as NewUsers } from '../../custom-migrations/postgres-entities/users.entity';
import { States } from '../../entities/entities/States';
import { States as NewStates } from '../../custom-migrations/postgres-entities/states.entity';
import { LocalGovernments } from '../../entities/entities/Localgovernments';
import { LocalGovernments as NewLgas } from '../../custom-migrations/postgres-entities/local-governments.entity';
import { Categories } from '../../custom-migrations/postgres-entities/category.entity';
import { Categories as OldCategories } from '../../entities/entities/Categories';
import { Sections } from '../../entities/entities/Sections';
import { Businesses } from '../../custom-migrations/postgres-entities/businesses.entity';
import { Businesses as OldBusiness } from '../../entities/entities/Businesses';

// SQLite Data Source (current one)
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'yenreach',
  synchronize: true, // Use with caution in production
  logging: false,
  entities: [
    // Your SQLite entities here
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

// PostgreSQL Data Source
export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'yenreach_user',
  password: 'yenreach',
  database: 'yenreach_migration_db',
  synchronize: true,
  logging: true,
  entities: [
    NewUsers,
    NewStates,
    NewLgas,
    Categories,
    Businesses,
    // Your PostgreSQL entities here
  ],
  // migrations: ['src/migrations/*.ts'],
  subscribers: [],
  extra: {
    connectTimeoutMillis: 60000, // Set a higher connection timeout (60 seconds)
    statement_timeout: 3600000, // Set a statement timeout of 1 hour (in milliseconds)
    idle_in_transaction_session_timeout: 7200000, // Set idle session timeout to 2 hours
  },
});

// MySQL or another SQL Data Source (you can choose MySQL, MariaDB, etc.)
export const SqlDataSource = new DataSource({
  type: 'mysql', // Or 'mariadb', depending on your SQL choice
  host: 'localhost',
  port: 3306,
  username: 'yenreach',
  password: 'yenreach',
  database: 'yenreach_migrate_db',
  synchronize: false,
  logging: false,
  entities: [
    Users,
    States,
    LocalGovernments,
    Sections,
    OldCategories,
    OldBusiness,

    // Your SQL entities here
  ],
  // migrations: ['src/migrations/*.ts'],
  subscribers: [],
  extra: {
    max: 50,
    connectTimeoutMillis: 60000, // Set a higher connection timeout (60 seconds)
    statement_timeout: 3600000, // Set a statement timeout of 1 hour (in milliseconds)
    idle_in_transaction_session_timeout: 7200000, // Set idle session timeout to 2 hours
  },
});

export default AppDataSource;
