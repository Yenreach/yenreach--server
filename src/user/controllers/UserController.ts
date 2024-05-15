import { NextFunction, Request, Response } from 'express';
import { UserRequester } from '../services';
import { getFileLink, sendResponse } from '@/core/utils';
import { HttpCodes } from '@/core/constants';
import { User as IUser } from '../interfaces';
import { logger } from '@/core/utils';
import { RequestWithUser } from '@/auth/interfaces';
import { UserProvider } from '../providers';
import { KYCProvider } from '../providers/KYCProvider';
import { IKyc } from '../interfaces/Kycinterfaces';

class UserController {

    public userProvider = new UserProvider();
    public kycProvider = new KYCProvider


    public getUserById = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const user = await this.userProvider.getUserById(userId);
            return sendResponse(res, HttpCodes.OK, 'User details retrieved successfully', user);
        } catch (error) {
            next(logger.error(error));
        }
    }

    public uploadProfilePic = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const displayPhoto = getFileLink(req);
            await this.userProvider.updateUser(userId, { displayPhoto });
            return sendResponse(res, HttpCodes.OK, 'Profile pic updated successfully');
        } catch (error) {
            next(logger.error(error));
        }
    }

    public changePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const { oldPassword, newPassword } = req.body;
            await this.userProvider.changeUserPassword(userId, oldPassword, newPassword);
            return sendResponse(res, HttpCodes.OK, 'Password changed successfully');
        } catch (error) {
            next(logger.error(error));
        }
    }

    public updateUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            const userData: IUser = { ...req.body };
            await this.userProvider.updateUser(userId, userData);
            return sendResponse(res, HttpCodes.OK, 'User updated successfully');
        } catch (error) {
            next(logger.error(error));
        }
    }

    public deleteUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const userId = req.user._id;
            await this.userProvider.deleteUser(userId);
            return sendResponse(res, HttpCodes.OK, 'User deleted successfully');
        } catch (error) {
            next(logger.error(error));
        }
    }

    public userRequester = UserRequester

    public sendNotificationHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
        } catch (error) {
            next(logger.error(error));
        }
    }


    public uploadNotificationTokenHandler = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            return sendResponse(res, HttpCodes.OK, 'Account Token updated successfully', await this.userProvider.updateUserToken({ email: req.body.email, token: req.body.token }))
        } catch (error) {
            next(logger.error(error));
        }
    }

    public startKycVerification = async (req: RequestWithUser, res: Response, next: NextFunction) => {
      try {
          const userId = req.user._id;
          const files = req.files as { [name: string]: Express.Multer.File[] };
          console.log(files)
          // const file: IFile[] = { ...req.body };
          const payload: IKyc = {
            userId,
            files
          }
          const data = await this.kycProvider.startKycVerification({payload});
          return sendResponse(res, HttpCodes.OK, 'Kyc Validation in Progress', data);
      } catch (error) {
          next(logger.error(error));
      }
  }



}

export { UserController };
