import { NextFunction, Response, Request } from 'express';
import { HttpException } from '../../core/exceptions';
import * as jwt from 'jsonwebtoken'
import { HttpCodes } from '../../core/constants'
import env from '../../config/env.config';
import { UserService } from '../../modules/user/services';

const userService = new UserService();

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractFromCookie(req) ?? extractTokenFromHeader(req)

    if (!token) throw new HttpException(HttpCodes.UNAUTHORIZED, "You are Not Authenticated");

    const decoded = jwt.verify(token, env.JWT_SECRET_KEY) as { id: number }

    const user = await userService.getUserById(decoded.id)

    if (!user) throw new HttpException(HttpCodes.UNAUTHORIZED, "Unauthorized access: User does not exist");

    req.user = user
    req.token = decoded

    next()
  } catch (error) {
    next(error);
    // next(new HttpException(HttpCodes.UNAUTHORIZED, 'Wrong authentication token used'));
  }
};


export const extractTokenFromHeader = (
  request: Request,
): string | undefined => {
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

export { authMiddleware }
