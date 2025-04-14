import AppDataSource from '../../../core/database';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { Jobs } from '../entities/jobs.entity';
import { CreateJobDto, UpdateJobDto } from '../schemas/jobs.schema';
class JobsService {
  private readonly jobRepository = AppDataSource.getRepository(Jobs);

  async createJob(data: CreateJobDto): Promise<Jobs> {
    const newJob = this.jobRepository.create(data);
    return await this.jobRepository.save(newJob);
  }

  async updateJob(id: number, data: UpdateJobDto): Promise<Jobs | null> {
    const jobs = await this.jobRepository.findOneBy({ id });
    if (!jobs) {
      throw new Error('Job not found');
    }
    Object.assign(jobs, data);
    return await this.jobRepository.save(jobs);
  }

  async getAllJobs(page = 1, limit = 10): Promise<PaginationResponse<Jobs>> {
    const { skip } = calculatePagination(page, limit);

    const [jobs, total] = await this.jobRepository.findAndCount({
      skip,
      take: limit,
    });

    return paginate(jobs, total, page, limit);
  }

  async getJobById(id: number): Promise<Jobs | null> {
    return await this.jobRepository.findOneBy({ id });
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await this.jobRepository.delete(id);
    return result.affected > 0;
  }
}

export { JobsService };
