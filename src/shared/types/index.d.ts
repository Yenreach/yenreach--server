// Extend the Request interface to include the user property when the middleware is used

import { Request } from 'express';
import { Users } from '../../database/entities/users.entity';
import { Admins } from '../../database/entities/admin.entity';

declare global {
  namespace Express {
    export interface Request {
      user?: Users | Admins;
      admin?: Admins;
      token?: { id: string };
    }
  }
}

export type RequestWithBody<BodyType> = Request<{}, any, BodyType>;
export type RequestWithParam<ParamType> = Request<ParamType, any, any>;
export type RequestWithQuery<QueryType> = Request<{}, any, any, QueryType | any>;
export type RequestWithParamAndBody<ParamType, BodyType> = Request<ParamType, any, BodyType>;
export type RequestWithParamAndQuery<ParamType, QueryType> = Request<ParamType, any, any, QueryType>;
