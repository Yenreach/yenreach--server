// Extend the Request interface to include the user property when the middleware is used

import { Request } from 'express';
import { Users } from '../../core/database/postgres/users.entity';

declare global {
  namespace Express {
    export interface Request {
      user?: Users;
      token?: { id: string };
    }
  }
}

export type RequestWithBody<BodyType> = Request<{}, any, BodyType>;
export type RequestWithParam<ParamType> = Request<ParamType, any, any>;
export type RequestWithQuery<QueryType> = Request<{}, any, any, QueryType>;
export type RequestWithParamAndBody<ParamType, BodyType> = Request<ParamType, any, BodyType>;
export type RequestWithParamAndQuery<ParamType, QueryType> = Request<ParamType, any, any, QueryType>;
