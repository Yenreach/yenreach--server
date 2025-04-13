import env from '../../config/env.config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: ['../postgres/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

export default AppDataSource;
