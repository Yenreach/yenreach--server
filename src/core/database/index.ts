import env from '../../config/env.config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: true,
  ...(env.NODE_ENV === 'production' ? {
    ssl: {
      rejectUnauthorized: false,
    },
    entities: ['dist/core/database/postgres/*.entity.js'],
  } : {
    entities: ['src/core/database/postgres/*.entity.ts'],
  }),
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  // entities: ['dist/core/database/postgres/*.entity.js'],
  subscribers: [],
});

export default AppDataSource;
