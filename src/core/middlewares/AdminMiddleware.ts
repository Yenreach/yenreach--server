import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '@config';
import { HttpException } from '@/core/exceptions';
import { RequestWithUser, TokenPayload } from '@/auth/interfaces';
import { Token } from '@/auth/models';
import { User } from '@/user/models'
import { HttpCodes } from '@/core/constants'

const adminMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authToken = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (authToken) {

      const secretKey: string = JWT_SECRET_KEY;

      const verificationResponse = verify(authToken, secretKey) as unknown as TokenPayload

      const response = await User.findById(await verificationResponse.userId)

      const token = await Token.findOne({ token: authToken })

      if (token.isBlacklisted === true) {
        next(new HttpException(HttpCodes.UNAUTHORIZED, 'Token already blacklisted'))
      }

      // console.log(response, verificationResponse)

      if (response) {
        req.user = response
        if (response.role != 'admin' && response.role != 'superAdmin') {
          next(new HttpException(HttpCodes.UNAUTHORIZED, 'You are not permitted to visit this route!'));
        }
        next();
      }
      else {
        next(new HttpException(HttpCodes.UNAUTHORIZED, 'No data attached to this token'));
      }
    } else {
      next(new HttpException(HttpCodes.UNAUTHORIZED, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(HttpCodes.UNAUTHORIZED, 'Wrong authentication token used'));
  }
};

export { adminMiddleware }
