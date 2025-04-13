import { DataSource } from 'typeorm';

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'yenreach_user',
  password: 'yenreach',
  database: 'yenreach_db',
  synchronize: true,
  logging: true,
  entities: ['src/core/database/postgres/*.entity.ts'],
});

export const SqlDataSource = new DataSource({
  type: 'mysql', //
  host: 'localhost',
  port: 3306,
  username: 'yenreach',
  password: 'yenreach',
  database: 'yenreach_migrate_db',
  synchronize: false,
  logging: false,
  entities: ['src/entities/*.entity.ts'],
});
