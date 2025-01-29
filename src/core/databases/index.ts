import { DataSource } from 'typeorm';
import { Users } from '../../modules/user/entities/user.entity';
import { Products } from '../../modules/products/entities/products.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  // type: 'mysql',
  // host: 'localhost',
  // port: 3306,
  // username: 'root',
  database: 'yenreach',
  synchronize: true, // Use with caution in production
  logging: false,
  entities: [
    Users,
    Products
    // Add other entities explicitly here if needed
  ],
  migrations: [],
  subscribers: [],
});
