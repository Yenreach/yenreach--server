import { Request, Response, NextFunction, Router } from 'express';
import { Routes } from '../../../core/routes/interfaces';
import { adminAuthMiddleware, authMiddleware } from '../../../core/middlewares';
import { validateRequest } from '../../../core/middlewares/ValidationMiddleware';
import { z } from 'zod';
import { BlogsController } from '../controllers';
import { CreateBlogSchema, UpdateBlogSchema } from '../schema';

class BlogsRoute implements Routes {
  public path = '/blogs';
  public router = Router();
  public BlogsController = new BlogsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(`${this.path}`, adminAuthMiddleware, validateRequest([z.object({ body: CreateBlogSchema })]), this.BlogsController.createBlog);

    this.router.get(`${this.path}`, this.BlogsController.getBlogs);

    this.router.get(`${this.path}/:id`, this.BlogsController.getBlog);

    this.router.patch(
      `${this.path}/:id`,
      adminAuthMiddleware,
      validateRequest([z.object({ body: UpdateBlogSchema })]),
      this.BlogsController.updateBlog,
    );

    this.router.delete(`${this.path}/:id`, adminAuthMiddleware, this.BlogsController.deleteBlog);
  }
}

export { BlogsRoute };
