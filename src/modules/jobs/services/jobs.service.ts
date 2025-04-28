import AppDataSource from '../../../core/database';
import { Businesses } from '../../../core/database/postgres/businesses.entity';
import { JobTags } from '../../../core/database/postgres/job-tags.entity';
import { Jobs } from '../../../core/database/postgres/jobs.entity';
import { calculatePagination, paginate } from '../../../core/utils/pagination/paginate';
import { PaginationResponse } from '../../../core/utils/pagination/pagination.interface';
import { JobStatus } from '../enums';
import { CreateJobDto, UpdateJobDto } from '../schemas/jobs.schema';
class JobsService {
  private readonly jobRepository = AppDataSource.getRepository(Jobs);
  private readonly jobTagsRepository = AppDataSource.getRepository(JobTags);
  private readonly businessRepository = AppDataSource.getRepository(Businesses);
  async createJob(data: CreateJobDto): Promise<Jobs> {
    const {
      businessString,
      companyName,
      title,
      type,
      location,
      salary,
      overview,
      benefit,
      link,
      expiryDate,
      tags = [],
    } = data;
  
    // Find the business by businessString
    const business = await this.businessRepository.findOne({ where: { verifyString: businessString } });
    if (!business) throw new Error('Business does not exist');
  
    // Create job entity
    const job = this.jobRepository.create({
      companyName,
      title,
      type,
      location,
      salary,
      // overview,
      benefit,
      link,
      expiryDate,
      status: JobStatus.Open,
      adminJob: false,
    });
  
    // Save the job entity
    const savedJob = await this.jobRepository.save(job);
  
    // Insert job tags
    const tagEntities = jobTags.map(tag =>
      this.jobTagsRepository.create({
        jobString: savedJob.jobString,
        tag: tag.tag,
      })
    );
    await this.jobTagsRepository.save(tagEntities);
  
    // Retrieve the saved tags
    const savedTags = await this.jobTagsRepository.find({
      where: { jobString: savedJob.jobString },
    });
  
    return {
      status: 'success',
      data: {
        id: savedJob.id,
        jobString: savedJob.jobString,
        businessString: savedJob.businessString,
        companyName: savedJob.companyName,
        jobTitle: savedJob.jobTitle,
        jobType: savedJob.jobType,
        location: savedJob.location,
        salary: savedJob.salary,
        jobOverview: savedJob.jobOverview,
        jobBenefit: savedJob.jobBenefit,
        jobTags: savedTags,
        jobLink: savedJob.jobLink,
        adminJob: savedJob.adminJob,
        status: savedJob.status,
        expiryDate: savedJob.expiryDate,
        createdAt: savedJob.createdAt,
        updatedAt: savedJob.updatedAt,
      },
    };
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
  //       jobString: savedJob.jobString,
  //       tag: tag.tag,
  //     })
  //   );
  //   await this.jobTagsRepository.save(tagEntities);
  
  //   const savedTags = await this.jobTagsRepository.find({
  //     where: { jobString: savedJob.jobString },
  //   });
  
  //   return {
  //     status: 'success',
  //     data: {
  //       id: savedJob.id,
  //       job_string: savedJob.jobString,
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

  async getAllJobs(page = 1, limit = 10): Promise<PaginationResponse<Jobs>> {
    const { skip } = calculatePagination(page, limit);

    const [jobs, total] = await this.jobRepository.findAndCount({
      skip,
      take: limit,
    });

    return paginate(jobs, total, page, limit);
  }

  async getJobById(id: string): Promise<Jobs | null> {
    return await this.jobRepository.findOneBy({ id });
  }

  async deleteJob(id: number): Promise<boolean> {
    const result = await this.jobRepository.delete(id);
    return result.affected > 0;
  }
}

export { JobsService };
