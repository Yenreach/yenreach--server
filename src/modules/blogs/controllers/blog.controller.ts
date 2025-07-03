import { NextFunction, Response, Request } from 'express';
import { RequestWithBody, RequestWithParam, RequestWithParamAndBody, RequestWithQuery } from '../../../types/express';
import { PathParams } from '../interfaces';
import { BlogsService } from '../services';
import { PaginationQueryParams } from '../../../core/utils/pagination';
import { CreateBlogDto, UpdateBlogDto } from '../schema';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { HttpException } from '../../../core/exceptions';

const blogsService = new BlogsService();

export class BlogsController {
  public async getBlog(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      const blog = await blogsService.getBlog(req.params.id);
      if (!blog) throw new HttpException(HttpCodes.NOT_FOUND, 'Blog not found');

      return sendResponse(res, HttpCodes.OK, 'Blog fetched successfully', blog);
    } catch (error) {
      next(error);
    }
  }

  public async getBlogs(req: RequestWithQuery<PaginationQueryParams>, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const blogs = await blogsService.getBlogs(page, limit);
      return sendResponse(res, HttpCodes.OK, 'Blogs fetched successfully', blogs);
    } catch (error) {
      next(error);
    }
  }

  public async createBlog(req: RequestWithBody<CreateBlogDto>, res: Response, next: NextFunction) {
    try {
      const newBlog = await blogsService.createBlog(req.user.id, req.body);
      return sendResponse(res, HttpCodes.CREATED, 'Blog created successfully', newBlog);
    } catch (error) {
      next(error);
    }
  }

  public async updateBlog(req: RequestWithParamAndBody<PathParams, UpdateBlogDto>, res: Response, next: NextFunction) {
    try {
      const updatedBlog = await blogsService.updateBlog(req.params.id, req.body);
      return sendResponse(res, HttpCodes.OK, 'Blog updated successfully', updatedBlog);
    } catch (error) {
      next(error);
    }
  }

  public async deleteBlog(req: RequestWithParam<PathParams>, res: Response, next: NextFunction) {
    try {
      await blogsService.deleteBlog(req.params.id);
      return sendResponse(res, HttpCodes.OK, 'Blog deleted successfully', null);
    } catch (error) {
      next(error);
    }
  }
}
