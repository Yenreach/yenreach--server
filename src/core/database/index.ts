import env from '../../config/env.config';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: ['src/core/database/postgres/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

export default AppDataSource;
