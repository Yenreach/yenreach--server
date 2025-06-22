import { NextFunction, Response, Request } from 'express';
import { RequestWithBody, RequestWithParam, RequestWithParamAndBody, RequestWithQuery } from '../../../types/express';
import { PathParams } from '../interfaces';
import { BlogsService } from '../services';
import { PaginationQueryParams } from '../../../core/utils/pagination';
import { CreateBlogDto, UpdateBlogDto } from '../schema';

export class BlogsController {
  private readonly blogsService = new BlogsService();

  public async getBlog(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      return await this.blogsService.getBlog(req.params.id);
    } catch (error) {
      next(error);
    }
  }

  public async getBlogs(req: RequestWithQuery<PaginationQueryParams>, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      return await this.blogsService.getBlogs(page, limit);
    } catch (error) {
      next(error);
    }
  }

  public async createBlog(req: RequestWithBody<CreateBlogDto>, res: Response, next: NextFunction) {
    try {
      return await this.blogsService.createBlog(req.user.id, req.body);
    } catch (error) {
      next(error);
    }
  }

  public async updateBlog(req: RequestWithParamAndBody<PathParams, UpdateBlogDto>, res: Response, next: NextFunction) {
    try {
      return await this.blogsService.updateBlog(req.params.id, req.body);
    } catch (error) {
      next(error);
    }
  }

  public async deleteBlog(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      return await this.blogsService.deleteBlog(req.params.id);
    } catch (error) {
      next(error);
    }
  }
}
