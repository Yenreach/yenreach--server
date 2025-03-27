import { DataSource } from 'typeorm';
// import { Users } from '../../modules/user/entities/user.entity';
// import { Products } from '../../modules/products/entities/products.entity';
import { Businesses } from '../../modules/business/entities/businesses.entity';
import { Cms } from '../../modules/cms/entities/cms.entity';
import { Image } from '../../modules/images/entities/image.entity';

const AppDataSource = new DataSource({
  // type: 'sqlite',
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  database: 'yenreach',
  synchronize: true, // Use with caution in production
  logging: false,
  entities: [
    Cms,
    Image,
    Businesses,
  ],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});

export default AppDataSource;
