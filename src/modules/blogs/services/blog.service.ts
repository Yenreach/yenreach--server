import { HttpCodes } from '../../../lib/constants';
import AppDataSource from '../../../database';
import { Blogs } from '../../../database/entities/blogs.entity';
import { HttpException } from '../../../lib/exceptions';
import { calculatePagination, paginate } from '../../../lib/pagination/paginate';
import { PaginationResponse } from '../../../lib/pagination/pagination.interface';
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
    // const [blogs, total] = await this.blogRepository.findAndCount({
    //   relations: {
    //     author: true,
    //   },
    //   skip,
    //   take: limit,
    //   order: {
    //     createdAt: 'DESC',
    //   },
    // });

    const [blogs, total] = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoin('blog.author', 'author')
      .addSelect(['author.id', 'author.name']) // only fetch id and name from author
      .orderBy('blog.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return paginate(blogs, total, page, limit);
  }

  public async getBlog(id: string): Promise<Blogs> {
    // const blog = await this.blogRepository.findOne({
    //   where: { id },
    //   relations: {
    //     author: true,
    //   },
    // });

    const blog = await this.blogRepository
      .createQueryBuilder('blog')
      .leftJoin('blog.author', 'author')
      .addSelect(['author.id', 'author.name']) // select only needed author fields
      .where('blog.id = :id', { id })
      .getOne();

    return blog;
  }

  public async deleteBlog(id: string): Promise<void> {
    const blog = await this.blogRepository.findOneBy({ id });

    if (!blog) throw new HttpException(HttpCodes.NOT_FOUND, 'Blog not found');

    await this.blogRepository.delete({ id });
  }

  public async updateBlog(id: string, data: UpdateBlogDto): Promise<Blogs> {
    const blog = await this.blogRepository.findOneBy({ id });

    if (!blog) throw new HttpException(HttpCodes.NOT_FOUND, 'Blog not found');

    Object.assign(blog, data);

    const updatedBlog = await this.blogRepository.save(blog);

    return updatedBlog;
  }
}
