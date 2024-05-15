import { Request, Response, NextFunction, Router } from 'express';
import { UserController } from '../controllers';
import { Routes } from '@/core/routes/interfaces';
import { authMiddleware, checkOwnership } from '@/core/middlewares';
import { upload } from '@/core/utils';
import { UploadController } from '@/upload/controllers';

class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.route(`${this.path}`)
      .get(this.userController.getUserById)
      .put(this.userController.updateUser)
      .delete(this.userController.deleteUser)

    this.router.post(`${this.path}/password/change`, this.userController.changePassword)

    this.router.post(`${this.path}/sendNotification`, this.userController.sendNotificationHandler)


    this.router.route(`${this.path}/profile/upload`)
      .post(upload.single('file'), this.userController.uploadProfilePic)

    this.router.route(`${this.path}/kyc`)
      .post(upload.fields([
        {name: 'PASSPORT_FRONT', maxCount: 1},
        {name: 'PASSPORT_BACK', maxCount: 1},
        {name: 'DRIVING_LICENCE_FRONT', maxCount: 1},
        {name: 'DRIVING_LICENCE_BACK', maxCount: 1},
        {name: 'ID_CARD_FRONT', maxCount: 1},
        {name: 'ID_CARD_BACK', maxCount: 1},
        {name: 'SELFIE', maxCount: 1},
        {name: 'UTILITY_BILL', maxCount: 1},
        {name: 'BANK_STATEMENT', maxCount: 1},
        {name: 'CREDIT_CARD_STATEMENT', maxCount: 1},
        {name: 'VIDEO_VERIFICATION', maxCount: 1},
      ]), this.userController.startKycVerification)
    }
}

export { UserRoute };

