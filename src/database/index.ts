import env from '../config/env.config';
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
  ...(env.NODE_ENV === 'production'
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
        entities: ['dist/database/entities/*.entity.js'],
        migrations: ['dist/database/migrations/*.js'],
      }
    : {
        entities: ['src/database/entities/*.entity.ts'],
        migrations: ['src/database/migrations/*.ts'],
      }),
});

export default AppDataSource;
