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
} from './core/routes';
import { BillboardAdminRoute, BillboardRoute } from './modules/billboard/routes';

import { BlogsRoute } from './modules/blogs/routes';

const app = new App([
  new IndexRoute(),
  new EmailRoute(),
  new SMSRoute(),
  new CmsRoute(),
  new UserRoute(),
  new AuthRoute(),
  new BusinessRoute(),
  new ProductsRoute(),
  new JobsRoute(),
  new PlanRoute(),
  new SubPlanRoute(),
  new PaymentRoute(),
  new AdminBusinessRoute(),
  new BlogsRoute(),
  new BillboardAdminRoute(),
  new BillboardRoute(),
]);

app.listen();
