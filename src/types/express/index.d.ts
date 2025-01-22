// Extend the Request interface to include the user property when the middleware is used

import { Users } from "../../modules/user/entities/user.entity";

declare global {
  namespace Express {
    export interface Request {
      user?: Users;
      token?: { id: number };
    }
  }
}