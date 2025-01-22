import App from './app';
import {
  IndexRoute,
  EmailRoute,
  SMSRoute,
  UserRoute,
  AuthRoute
} from './core/routes';
import { validateEnv } from './core/utils/validateEnv';

validateEnv();

const app = new App([
  new IndexRoute(),
  new EmailRoute(),
  new SMSRoute(),
  new UserRoute(),
  new AuthRoute(),
]);

app.listen()
