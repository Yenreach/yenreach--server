import { DataSource } from 'typeorm';
import env from '../config/env.config';
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
import { Productphotos } from '../core/database/entities/entities/Productphotos';
import { Jobtags } from '../core/database/entities/entities/Jobtags';
import { Jobs as OldJobs } from '../core/database/entities/entities/Jobs';
import { Products as OldProducts } from '../core/database/entities/entities/Products';
import { Comments as OldComments } from '../core/database/entities/entities/Comments';
import { Feedback } from '../core/database/entities/entities/Feedback';
import { Savedbusinesses } from '../core/database/entities/entities/Savedbusinesses';
import { Admins as OldAdmins } from '../core/database/entities/entities/Admins';
import { Blogpost } from '../core/database/entities/entities/Blogpost';
import { Businessreviews } from '../core/database/entities/entities/Businessreviews';
import { Businessworkinghours } from '../core/database/entities/entities/Businessworkinghours';
import { Productcategories } from '../core/database/entities/entities/Productcategories';
import { CardToken } from '../core/database/postgres/card-token.entity';
import { SubPlan } from '../core/database/postgres/subplan.entity';
import { Plan } from '../core/database/postgres/plan.entity';
import { SubscriptionPayment } from '../core/database/postgres/payment.entity';

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
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
    CardToken,
    SubPlan,
    Plan,
    SubscriptionPayment,
  ],
});

export const SqlDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST_OLD,
  port: env.DB_PORT_OLD,
  username: env.DB_USER_OLD,
  password: env.DB_PASSWORD_OLD,
  database: env.DB_NAME_OLD,
  synchronize: false,
  logging: true,
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
    Productphotos,
    Jobtags,
    Feedback,
    Savedbusinesses,
    OldJobs,
    OldProducts,
    OldComments,
    Blogpost,
    Businessreviews,
    Businessworkinghours,
    OldAdmins,
    Productcategories,
  ],
});
