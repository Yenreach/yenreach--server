import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services';
import { sendResponse } from '../../../lib/utils';
import { HttpCodes } from '../../../lib/constants';
import { HttpException } from '../../../lib/exceptions';
import { CreateUserDto, UpdateUserDto } from '../schemas';

const userService = new UserService();

class UserController {
  public test = new UserService();
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await userService.createUser(userData);

      return sendResponse(res, HttpCodes.CREATED, 'user created successfully', newUser);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const updateData: UpdateUserDto = req.body;
      const updatedUser = await userService.updateUser(userId, updateData);
      return sendResponse(res, HttpCodes.OK, 'user updated successfully', updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const users = await userService.getAllUsers(page, limit);

      return sendResponse(res, HttpCodes.OK, 'users fetched successfully', users);
    } catch (error) {
      next(error);
    }
  }

  async getAllAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const admins = await userService.getAllAdmins(page, limit);

      return sendResponse(res, HttpCodes.OK, 'admins fetched successfully', admins);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await userService.getUserById(userId);
      if (!user) {
        throw new HttpException(HttpCodes.NOT_FOUND, 'user do not exists');
      }
      return sendResponse(res, HttpCodes.OK, 'user fetched successfully', user);
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      console.log({ userId });
      const user = await userService.getUserById(userId);
      if (!user) {
        throw new HttpException(HttpCodes.NOT_FOUND, 'user do not exists');
      }
      return sendResponse(res, HttpCodes.OK, 'user fetched successfully', user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const result = await userService.deleteUser(userId);
      return sendResponse(res, HttpCodes.OK, 'user deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };
