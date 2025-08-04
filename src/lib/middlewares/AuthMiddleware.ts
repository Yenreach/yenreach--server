import { NextFunction, Response, Request } from 'express';
import { HttpException } from '../exceptions';
import * as jwt from 'jsonwebtoken';
import { HttpCodes } from '../constants';
import env from '../../config/env.config';
import { UserService } from '../../modules/user/services';

const userService = new UserService();

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractFromCookie(req) ?? extractTokenFromHeader(req);

    if (!token) throw new HttpException(HttpCodes.UNAUTHORIZED, 'You are Not Authenticated');

    const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as { id: string };

    const user = await userService.getUserById(decoded.id);

    if (!user) throw new HttpException(HttpCodes.UNAUTHORIZED, 'Unauthorized access: User does not exist');

    req.user = user;
    req.token = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpException(HttpCodes.UNAUTHORIZED, 'Unauthorized access:Invalid or expired token'));
    }
    next(error);
    // next(new HttpException(HttpCodes.UNAUTHORIZED, 'Wrong authentication token used'));
  }
};

const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractFromCookie(req) ?? extractTokenFromHeader(req);

    if (!token) throw new HttpException(HttpCodes.UNAUTHORIZED, 'You are Not Authenticated');

    const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as { id: string };

    const user = await userService.getAdminById(decoded.id);

    if (!user) throw new HttpException(HttpCodes.UNAUTHORIZED, 'Unauthorized access: User does not exist');

    req.admin = user;
    req.user = user;
    req.token = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new HttpException(HttpCodes.UNAUTHORIZED, 'Unauthorized access:Invalid or expired token'));
    }
    next(error);
  }
};

export const extractTokenFromHeader = (request: Request): string | undefined => {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
};

export const extractFromCookie = (req: Request): string | null => {
  let token: string | null = null;
  if (req && req.cookies) {
    token = req.cookies['Authentication'];
  }
  return token;
};

export { authMiddleware, adminAuthMiddleware };
