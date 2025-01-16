import { Request, Response, NextFunction, Router } from 'express';
import { UserController } from '../controllers';
import { Routes } from '../../../core/routes/interfaces';
class UserRoute implements Routes {
  public path = '/user';
  public router = Router();
  public UserController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.post(`${this.path}/`, this.UserController.createUser)

    this.router.get(`${this.path}/`, this.UserController.getAllUsers)

    this.router.get(`${this.path}/:id`, this.UserController.getUserById)

    this.router.put(`${this.path}/:id`, this.UserController.updateUser)

    this.router.delete(`${this.path}/:id`, this.UserController.deleteUser)
  }
}

export { UserRoute };

