import App from '@/app';
import {
  IndexRoute,
  EmailRoute,
  UserRoute
} from '@/core/routes';
import { validateEnv } from '@/core/utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new EmailRoute(), new UserRoute()
]);

app.listen()


