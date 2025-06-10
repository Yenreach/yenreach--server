import App from './app';
import {
  IndexRoute,
  EmailRoute,
  SMSRoute, CmsRoute,
  UserRoute, BusinessRoute,
  ProductsRoute, JobsRoute,
  PlanRoute, SubPlanRoute,
  PaymentRoute,
  AuthRoute
} from './core/routes';
import { validateEnv } from './core/utils/validateEnv';
<<<<<<< HEAD


validateEnv();

const app = new App([
  new IndexRoute(), new EmailRoute(),
  new SMSRoute(), new CmsRoute(),
  new UserRoute(), new AuthRoute(),
  new BusinessRoute(), new ProductsRoute(),
  new JobsRoute(), new PlanRoute(),
  new SubPlanRoute(), new PaymentRoute()
]);
=======
import { BusinessRoute } from './modules/business/routes';
import { AdminBusinessRoute } from './modules/business/routes/business-admin.route';
import { JobsRoute } from './modules/jobs/routes';
import { ProductsRoute } from './modules/products/routes';

validateEnv();

const app = new App([new IndexRoute(), new EmailRoute(), new SMSRoute(), new CmsRoute(), new UserRoute(), new AuthRoute(), new BusinessRoute(), new AdminBusinessRoute(), new ProductsRoute(), new JobsRoute()]);
>>>>>>> 3cc3a3dd10888b0888b256f4a5b4b3642ff3c1a6

app.listen();
