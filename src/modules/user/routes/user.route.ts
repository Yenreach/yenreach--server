import { Request, Response, NextFunction, Router } from 'express';
import { UserController } from '../controllers';
import { Routes } from '../../../core/routes/interfaces';
import { adminAuthMiddleware, authMiddleware } from '../../../core/middlewares';
class UserRoute implements Routes {
  public path = '/users';
  public adminPath = '/users/admin';
  public router = Router();
  public UserController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.post(`${this.path}/`, authMiddleware, this.UserController.createUser)

    this.router.get(`${this.path}/`, authMiddleware, this.UserController.getAllUsers)
    
    this.router.get(`${this.adminPath}/`, adminAuthMiddleware, this.UserController.getAllAdmins)

    this.router.get(`${this.path}/me`, authMiddleware, this.UserController.getUserProfile)

    this.router.get(`${this.path}/:id`, authMiddleware, this.UserController.getUserById)

    this.router.put(`${this.path}/:id`, authMiddleware, this.UserController.updateUser)

    this.router.delete(`${this.path}/:id`, authMiddleware, this.UserController.deleteUser)
  }
}

export { UserRoute };

