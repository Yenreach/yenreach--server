import { DataSource } from 'typeorm';
import { Users } from '../../modules/user/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  database: 'yenreach',
  synchronize: true, // Use with caution in production
  logging: false,
  entities: [
    Users,
    // Add other entities explicitly here if needed
  ],
  migrations: [],
  subscribers: [],
});
