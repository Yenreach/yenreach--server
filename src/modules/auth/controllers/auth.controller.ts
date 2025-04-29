import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { CreateAuthDto, LoginDto } from '../schemas';

const authService = new AuthService();

class AuthController {
  public test = new AuthService();
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateAuthDto = req.body;
      const newUser = await authService.register(userData);
      return sendResponse(res, HttpCodes.CREATED, 'user created successfully', newUser);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: LoginDto = req.body;
      const user = await authService.login({ userData, response: res });

      return sendResponse(res, HttpCodes.CREATED, 'user Logged in successfully', user);
    } catch (error) {
      next(error);
    }
  }
}

export { AuthController };
