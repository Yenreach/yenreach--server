import App from './app';
import {
  IndexRoute,
  EmailRoute,
  SMSRoute,
  UserRoute
} from './core/routes';
import { validateEnv } from './core/utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new SMSRoute(), new EmailRoute(), new UserRoute()
]);

app.listen()


