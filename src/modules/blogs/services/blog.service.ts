import { HttpCodes } from '../../../core/constants';
import AppDataSource from '../../../core/database';
import { Blogs } from '../../../core/database/postgres/blogs.entity';
import { HttpException } from '../../../core/exceptions';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { CreateBlogDto, UpdateBlogDto } from '../schema';

export class BlogsService {
  private readonly blogRepository = AppDataSource.getRepository(Blogs);

  public async createBlog(authorId: string, data: CreateBlogDto): Promise<Blogs> {
    const newBlog = this.blogRepository.create({
      ...data,
      authorId,
    });

    const savedBlog = await this.blogRepository.save(newBlog);

    return savedBlog;
  }

  public async getBlogs(page: number = 1, limit: number = 10): Promise<PaginationResponse<Blogs>> {
    const { skip } = calculatePagination(page, limit);
    console.log('hit here too');
    const [blogs, total] = await this.blogRepository.findAndCount({
      relations: {
        author: true,
      },
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return paginate(blogs, total, page, limit);
  }

  public async getBlog(id: string): Promise<Blogs> {
    const blog = await this.blogRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });

    return blog;
  }

  public async deleteBlog(id: string): Promise<void> {
    const blog = await this.blogRepository.findOneBy({ id });

    if (!blog) throw new HttpException(HttpCodes.NOT_FOUND, 'Blog not found');

    await this.blogRepository.delete(blog);
  }

  public async updateBlog(id: string, data: UpdateBlogDto): Promise<Blogs> {
    const blog = await this.blogRepository.findOneBy({ id });

    if (!blog) throw new HttpException(HttpCodes.NOT_FOUND, 'Blog not found');

    Object.assign(blog, data);

    const updatedBlog = await this.blogRepository.save(blog);

    return updatedBlog;
  }
}
