import { NextFunction, Request, Response } from 'express';
import { JobsService } from '../services';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { HttpException } from '../../../core/exceptions';
import { CreateJobDto, GetJobsSchema, UpdateJobDto } from '../schemas/jobs.schema';

const jobsService = new JobsService();

class JobsController {
  public test = new JobsService();
  async createJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobsData: CreateJobDto = req.body;
      const newJobs = await jobsService.createJob(jobsData);

      return sendResponse(res, HttpCodes.CREATED, 'job created successfully', newJobs);
    } catch (error) {
      next(error);
    }
  }

  async adminCreateJob(req: Request, res: Response, next: NextFunction) {
    try {
      const jobsData: CreateJobDto = req.body;
      const newJobs = await jobsService.adminCreateJob(jobsData);

      return sendResponse(res, HttpCodes.CREATED, 'job created successfully', newJobs);
    } catch (error) {
      next(error);
    }
  }

  async updateJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id;
      const updateData: UpdateJobDto = req.body;
      const updatedJob = await jobsService.updateJob(jobId, updateData);
      return sendResponse(res, HttpCodes.OK, 'job updated successfully', updatedJob);
    } catch (error) {
      next(error);
    }
  }

  async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams = GetJobsSchema.parse(req.query);

      const jobs = await jobsService.getAllJobs(queryParams);

      return sendResponse(res, HttpCodes.OK, 'jobs fetched successfully', jobs);
    } catch (error) {
      next(error);
    }
  }

  async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the query using Zod
      const queryParams = GetJobsSchema.parse(req.query);

      const result = await jobsService.getJobsPublic(queryParams);

      return sendResponse(res, HttpCodes.OK, "Jobs retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getBusinessJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const business = req.params.business_string;
      const queryParams = GetJobsSchema.parse(req.query);

      if (!business) throw Error('Business String must be sent')

      const result = await jobsService.getJobsPublic({ ...queryParams, business });

      return sendResponse(res, HttpCodes.OK, "Jobs retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getRelatedJobs(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate the query using Zod
      const jobId = req.params.id;
      const jobs = await jobsService.getRelatedJobs(jobId);
      return sendResponse(res, HttpCodes.OK, 'related jobs fetched successfully', jobs);
    } catch (error) {
      next(error);
    }
  }

  async getJobsById(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id;
      const jobs = await jobsService.getJobById(jobId);
      if (!jobs) {
        throw new HttpException(HttpCodes.NOT_FOUND, 'job do not exists');
      }
      return sendResponse(res, HttpCodes.OK, 'job fetched successfully', jobs);
    } catch (error) {
      next(error);
    }
  }

  async deleteJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobId = req.params.id;
      const result = await jobsService.deleteJob(jobId);
      return sendResponse(res, HttpCodes.OK, 'job deleted successfully', result);
    } catch (error) {
      next(error);
    }
  }
}

export { JobsController };
