import env from '../../config/env.config';
import { DataSource } from 'typeorm';
import { Blogs } from './postgres/blogs.entity';
import { BusinessCategories } from './postgres/business-categories.entity';
import { BusinessPhotos } from './postgres/business-photos.entity';
import { BusinessReviews } from './postgres/business-reviews.entity';
import { BusinessVideos } from './postgres/business-videos.entity';
import { BusinessWorkingHours } from './postgres/business-working-hours.entity';
import { Businesses } from './postgres/businesses.entity';
import { Comments } from './postgres/comments.entity';
import { JobTags } from './postgres/job-tags.entity';
import { LocalGovernments } from './postgres/local-governments.entity';
import { ProductPhotos } from './postgres/product-photos.entity';
import { States } from './postgres/states.entity';
import { Categories } from './postgres/category.entity';
import { ProductCategories } from './postgres/product-category.entity';
import { SavedBusinesses } from './postgres/saved-business.entity';
import { Users } from './postgres/users.entity';
import { Admins } from './postgres/admin.entity';
import { Feedbacks } from './postgres/feedback.entity';
import { Jobs } from './postgres/jobs.entity';
import { Cms } from './postgres/cms.entity';
import { Images } from './postgres/image.entity';
import { Products } from './postgres/product.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [
    Admins,
    Blogs,
    BusinessCategories,
    BusinessPhotos,
    BusinessVideos,
    BusinessWorkingHours,
    BusinessReviews,
    Businesses,
    Categories,
    Comments,
    Feedbacks,
    JobTags,
    Jobs,
    LocalGovernments,
    Products,
    ProductCategories,
    ProductPhotos,
    SavedBusinesses,
    States,
    Users,
    Images,
    Cms
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

export default AppDataSource;
