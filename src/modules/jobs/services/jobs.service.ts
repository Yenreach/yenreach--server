import { FindManyOptions, Like } from 'typeorm';
import AppDataSource from '../../../database';
import { Businesses } from '../../../database/entities/businesses.entity';
import { JobTags } from '../../../database/entities/job-tags.entity';
import { Jobs } from '../../../database/entities/jobs.entity';
import { calculatePagination, paginate } from '../../../lib/pagination/paginate';
import { PaginationResponse } from '../../../lib/pagination/pagination.interface';
import { JobStatus } from '../enums';
import { CreateJobDto, GetJobsDto, UpdateJobDto } from '../schemas/jobs.schema';
class JobsService {
  private readonly jobRepository = AppDataSource.getRepository(Jobs);
  private readonly jobTagsRepository = AppDataSource.getRepository(JobTags);
  private readonly businessRepository = AppDataSource.getRepository(Businesses);

  async createJob(data: CreateJobDto): Promise<any> {
    const { businessId, tags = [], ...jobData } = data;

    // Find the business by businessString
    const business = await this.businessRepository.findOne({ where: { id: businessId } });
    if (!business) throw new Error('Business does not exist');

    // Create job entity
    const job = this.jobRepository.create({
      ...jobData,
      businessId,
      jobString: businessId,
    });

    // Save the job entity
    const savedJob = await this.jobRepository.save(job);

    // Insert job tags
    // const tagEntities = tags.map(tag =>
    //   this.jobTagsRepository.create({
    //     jobId: savedJob.id,
    //     tag,
    //   })
    // );
    // await this.jobTagsRepository.save(tagEntities);

    return { status: 'success', data: savedJob };
  }

  async adminCreateJob(data: CreateJobDto): Promise<any> {
    const { businessId, tags = [], ...jobData } = data;

    // Create job entity
    const job = this.jobRepository.create({
      ...jobData,
      isAdminJob: true,
    });

    // Save the job entity
    const savedJob = await this.jobRepository.save(job);

    // // Insert job tags
    // const tagEntities = tags.map(tag =>
    //   this.jobTagsRepository.create({
    //     jobId: savedJob.id,
    //     tag,
    //   })
    // );
    // await this.jobTagsRepository.save(tagEntities);

    return { status: 'success', data: savedJob };
  }

  // async createJob(data: CreateJobDto): Promise<any> {
  //   const {
  //     admin_string,
  //     company_name,
  //     job_title,
  //     job_type,
  //     location,
  //     salary,
  //     job_overview,
  //     job_benefit,
  //     job_link,
  //     expiry_date,
  //     job_tags = [],
  //   } = data;

  //   // Find the admin
  //   const admin = await this.adminRepository.findOne({ where: { verifyString: admin_string } });
  //   if (!admin) throw new Error('Admin does not exist');

  //   // Create job entity
  //   const job = this.jobRepository.create({
  //     adminString: admin_string,
  //     companyName: company_name,
  //     jobTitle: job_title,
  //     jobType: job_type,
  //     location,
  //     salary,
  //     jobOverview: job_overview,
  //     jobBenefit: job_benefit,
  //     jobLink: job_link,
  //     expiryDate: expiry_date,
  //     status: true,
  //     adminJob: true,
  //   });

  //   // Save job
  //   const savedJob = await this.jobRepository.save(job);

  //   // Save job tags
  //   const tagEntities = job_tags.map(tag =>
  //     this.jobTagsRepository.create({
  //       id: savedJob.id,
  //       tag: tag,
  //     })
  //   );
  //   await this.jobTagsRepository.save(tagEntities);

  //   const savedTags = await this.jobTagsRepository.find({
  //     where: { id: savedJob.id },
  //   });

  //   return {
  //     status: 'success',
  //     data: {
  //       id: savedJob.id,
  //       job_string: savedJob.id,
  //       admin_string: savedJob.adminString,
  //       company_name: savedJob.companyName,
  //       job_title: savedJob.jobTitle,
  //       job_type: savedJob.jobType,
  //       location: savedJob.location,
  //       salary: savedJob.salary,
  //       job_overview: savedJob.jobOverview,
  //       job_benefit: savedJob.jobBenefit,
  //       job_tags: savedTags,
  //       job_link: savedJob.jobLink,
  //       admin_job: savedJob.adminJob,
  //       status: savedJob.status,
  //       expiry_date: savedJob.expiryDate,
  //       created_at: savedJob.createdAt,
  //       updated_at: savedJob.updatedAt,
  //     },
  //   };
  // }

  async updateJob(id: string, data: UpdateJobDto): Promise<Jobs | null> {
    const jobs = await this.jobRepository.findOneBy({ id });
    if (!jobs) {
      throw new Error('Job not found');
    }
    Object.assign(jobs, data);
    return await this.jobRepository.save(jobs);
  }

  async getAllJobs({ page = 1, limit = 20, search = '', business, tag }: GetJobsDto & { tag?: string }): Promise<PaginationResponse<Jobs>> {
    const { skip } = calculatePagination(page, limit);
    const queryConditions: FindManyOptions<Jobs> = {
      relations: ['tags'],
      skip,
      take: limit,
    };

    if (business) {
      queryConditions.where = {
        businessId: business,
      };
    }
    if (search) {
      queryConditions.where = [
        {
          ...(queryConditions.where || {}),
          title: Like(`%${search}%`),
        },
        // { tags: { tag: In(`%${search}%`) } },
      ];

      queryConditions.join = {
        alias: 'job',
        leftJoinAndSelect: {
          tags: 'job.tags',
        },
      };
    }

    const [jobs, total] = await this.jobRepository.findAndCount(queryConditions);

    return paginate(jobs, total, page, limit);
  }

  async getJobsPublic({ page = 1, limit = 20, search = '', business, tag }: GetJobsDto & { tag?: string }) {
    const { skip } = calculatePagination(page, limit);

    const queryConditions: FindManyOptions<Jobs> = {
      where: {
        status: JobStatus.Open,
        ...(business && { businessId: business }),
      },
      relations: ['tags'],
      skip,
      take: limit,
    };

    if (search) {
      queryConditions.where = [
        {
          ...queryConditions.where,
          title: Like(`%${search}%`),
        },
        // { tags: { tag: In(`%${search}%`) } },
      ];

      queryConditions.join = {
        alias: 'job',
        leftJoinAndSelect: {
          tags: 'job.tags',
        },
      };
    }

    const [jobs, total] = await this.jobRepository.findAndCount(queryConditions);

    return paginate(jobs, total, page, limit);
  }

  async getRelatedJobs(jobId: string, limit = 5) {
    const job = await this.jobRepository.findOne({
      where: { id: jobId },
      relations: ['tags'],
    });

    if (!job) throw new Error('job not found');

    const tags = job.tags.map(tag => tag.id);
    if (!tags?.length) {
      // throw new Error("Job categories not found");
      return {
        status: 'success',
        data: [],
      };
    }
    console.log({ tags });
    // Find related jobs that share at least one tag
    const relatedJobs = await this.jobRepository
      .createQueryBuilder('job')
      .innerJoin('job.tags', 'tag')
      .where('tag.id IN (:...tags)', { tags })
      .andWhere('job.id != :jobId', { jobId }) // Exclude the current job
      .andWhere('job.status = :status', { status: JobStatus.Open }) // Filter active jobs
      .take(limit)
      .getMany();

    return {
      status: 'success',
      data: relatedJobs,
    };
  }

  async getJobById(id: string): Promise<Jobs | null> {
    return await this.jobRepository.findOneBy({ id });
  }

  async deleteJob(id: string): Promise<boolean> {
    const result = await this.jobRepository.delete(id);
    return result.affected > 0;
  }
}

export { JobsService };
