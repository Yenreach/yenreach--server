import { DataSource } from 'typeorm';
import { Users } from '../../modules/user/entities/user.entity';
import { Businesses } from '../../modules/business/entities/businesses.entity';
import { Products } from '../../modules/products/entities/products.entity';
import { ProductPhoto } from '../../modules/products/entities/product-photos.entity';
import { ProductCategory } from '../../modules/products/entities/product-categories.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  // type: 'mysql',
  // host: 'localhost',
  // port: 3306,
  // username: 'yenreach',
  // password: 'password',
  database: 'yenreach',
  synchronize: true, // Use with caution in production
  logging: false,
  entities: [
    // Users,
    Products,
    ProductPhoto,
    ProductCategory,
    // Add other entities explicitly here if needed
    Businesses,
  ],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});

export default AppDataSource;
