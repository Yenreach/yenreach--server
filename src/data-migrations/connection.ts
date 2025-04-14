import { DataSource } from 'typeorm';
import { Blogs } from '../core/database/postgres/blogs.entity';
import { BusinessCategories } from '../core/database/postgres/business-categories.entity';
import { BusinessPhotos } from '../core/database/postgres/business-photos.entity';
import { BusinessReviews } from '../core/database/postgres/business-reviews.entity';
import { BusinessVideos } from '../core/database/postgres/business-videos.entity';
import { BusinessWorkingHours } from '../core/database/postgres/business-working-hours.entity';
import { Businesses } from '../core/database/postgres/businesses.entity';
import { Comments } from '../core/database/postgres/comments.entity';
import { JobTags } from '../core/database/postgres/job-tags.entity';
import { LocalGovernments } from '../core/database/postgres/local-governments.entity';
import { ProductPhotos } from '../core/database/postgres/product-photos.entity';
import { States } from '../core/database/postgres/states.entity';
import { Categories } from '../core/database/postgres/category.entity';
import { ProductCategories } from '../core/database/postgres/product-category.entity';
import { SavedBusinesses } from '../core/database/postgres/saved-business.entity';
import { Users } from '../core/database/postgres/users.entity';
import { Admins } from '../core/database/postgres/admin.entity';
import { Feedbacks } from '../core/database/postgres/feedback.entity';
import { Jobs } from '../core/database/postgres/jobs.entity';
import { Products } from '../core/database/postgres/product.entity';
import { Users as OldUsers } from '../core/database/entities/entities/Users';
import { States as OldStates } from '../core/database/entities/entities/States';
import { Sections } from '../core/database/entities/entities/Sections';
import { LocalGovernments as OldLocalGovernments } from '../core/database/entities/entities/Localgovernments';
import { Categories as OldCategories } from '../core/database/entities/entities/Categories';
import { Productcategorylist } from '../core/database/entities/entities/Productcategorylist';
import { Businesses as oldBusinesses } from '../core/database/entities/entities/Businesses';
import { Businesscategories } from '../core/database/entities/entities/Businesscategories';
import { Businessphotos } from '../core/database/entities/entities/Businessphotos';
import { Businessvideolinks } from '../core/database/entities/entities/Businessvideolinks';

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5434,
  username: 'yenreach_user',
  password: 'yenreach',
  database: 'yenreach_db',
  synchronize: true,
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
  ],
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
  entities: [
    OldUsers,
    OldStates,
    Sections,
    OldLocalGovernments,
    OldCategories,
    Productcategorylist,
    oldBusinesses,
    Businesscategories,
    Businessphotos,
    Businessvideolinks,
  ],
});
