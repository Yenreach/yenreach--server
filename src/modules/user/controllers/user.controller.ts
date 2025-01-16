import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { Exception } from 'handlebars';
import { HttpException } from '../../../core/exceptions';

const userService = new UserService();

class UserController {
  public test = new UserService()
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: CreateUserDto = req.body;
      const newUser = await userService.createUser(userData);

      return sendResponse(res, HttpCodes.CREATED, "user created successfully", newUser)
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      const updateData: UpdateUserDto = req.body;
      const updatedUser = await userService.updateUser(userId, updateData);
      return sendResponse(res, HttpCodes.OK, "user updated successfully", updatedUser)
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const users = await userService.getAllUsers(page, limit);

      return sendResponse(res, HttpCodes.OK, "users fetched successfully", users)
    } catch (error) {
      next(error)
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      const user = await userService.getUserById(userId);
      if (!user) {
        throw new HttpException(HttpCodes.NOT_FOUND, "user do not exists");
      }
      return sendResponse(res, HttpCodes.OK, "user fetched successfully", user)
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id);
      const result = await userService.deleteUser(userId);
      return sendResponse(res, HttpCodes.OK, "user deleted successfully", result)
    } catch (error) {
      next(error)
    }
  }
}

export { UserController }
