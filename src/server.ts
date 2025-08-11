import App from './app';
import {
  IndexRoute,
  EmailRoute,
  SMSRoute,
  CmsRoute,
  UserRoute,
  BusinessRoute,
  ProductsRoute,
  JobsRoute,
  PlanRoute,
  SubPlanRoute,
  PaymentRoute,
  AuthRoute,
  AdminBusinessRoute,
} from './lib/routes';
import { logger } from './lib/utils';
import { BillboardAdminRoute, BillboardRoute } from './modules/billboard/routes';

import { BlogsRoute } from './modules/blogs/routes';
import { ProductsAdminRoute } from './modules/products/routes/product-admin.route';
import { SettingsRoute } from './modules/settings/routes';
import { SettingsService } from './modules/settings/services';

// const app = new App([
//   new IndexRoute(),
//   new EmailRoute(),
//   new SMSRoute(),
//   new CmsRoute(),
//   new UserRoute(),
//   new AuthRoute(),
//   new BusinessRoute(),
//   new ProductsRoute(),
//   new JobsRoute(),
//   new PlanRoute(),
//   new SubPlanRoute(),
//   new PaymentRoute(),
//   new AdminBusinessRoute(),
//   new BlogsRoute(),
//   new BillboardAdminRoute(),
//   new BillboardRoute(),
//   new ProductsAdminRoute(),
//   new SettingsRoute(),
// ]);

const app = new App();

app.initialize([
  new IndexRoute(),
  new EmailRoute(),
  new SMSRoute(),
  new CmsRoute(),
  new UserRoute(),
  new AuthRoute(),
  new BusinessRoute(),
  new JobsRoute(),
  new PlanRoute(),
  new SubPlanRoute(),
  new PaymentRoute(),
  new AdminBusinessRoute(),
  new BlogsRoute(),
  new BillboardAdminRoute(),
  new BillboardRoute(),
  new ProductsAdminRoute(),
  new ProductsRoute(),
  new SettingsRoute(),
]);

app.listen();
