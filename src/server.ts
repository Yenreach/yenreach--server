import App from './app';
import { IndexRoute, EmailRoute, SMSRoute, CmsRoute, UserRoute, AuthRoute } from './core/routes';
import { validateEnv } from './core/utils/validateEnv';
import { BusinessRoute } from './modules/business/routes';
import { JobsRoute } from './modules/jobs/routes';
import { ProductsRoute } from './modules/products/routes';

validateEnv();

const app = new App([new IndexRoute(), new EmailRoute(), new SMSRoute(), new CmsRoute(), new UserRoute(), new AuthRoute(), new BusinessRoute(), new ProductsRoute(), new JobsRoute()]);

app.listen();
