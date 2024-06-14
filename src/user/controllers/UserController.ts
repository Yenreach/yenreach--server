import { NextFunction, Request, Response } from 'express';
import { getFileLink, sendResponse } from '@/core/utils';
import { HttpCodes } from '@/core/constants';
import { User as IUser } from '../interfaces';
import { logger } from '@/core/utils';

import { UserProvider } from '../providers';
import { EmailProvider } from '@/email/providers';
import { HttpException } from '@/core/exceptions';

class UserController {

  public userProvider = new UserProvider();

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: IUser = { ...req.body };
      await this.userProvider.createUser(userData);
      return sendResponse(res, HttpCodes.OK, 'User created successfully');
    } catch (error) {
      next(logger.error(error));
    }
  }


}

export { UserController };
