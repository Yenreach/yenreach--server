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


validateEnv();

const app = new App([
  new IndexRoute(), new EmailRoute(),
  new SMSRoute(), new CmsRoute(),
  new UserRoute(), new AuthRoute(),
  new BusinessRoute(), new ProductsRoute(),
  new JobsRoute(), new PlanRoute(),
  new SubPlanRoute(), new PaymentRoute()
]);

app.listen();
