import { Request, Response, NextFunction, Router } from 'express';
import { JobsController } from '../controllers';
import { Routes } from '../../../lib/routes/interfaces';
import { adminAuthMiddleware, authMiddleware } from '../../../lib/middlewares';
import { validateRequest } from '../../../lib/middlewares/ValidationMiddleware';
import { JobSchema } from '../schemas/jobs.schema';
import { z } from 'zod';

class JobsRoute implements Routes {
  public path = '/jobs';
  public adminPath = '/jobs/admin';
  public router = Router();
  public JobsController = new JobsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next();
    });

    this.router.post(`${this.path}/`, authMiddleware, validateRequest([z.object({ body: JobSchema })]), this.JobsController.createJobs);

    this.router.post(`${this.adminPath}`, adminAuthMiddleware, validateRequest([z.object({ body: JobSchema })]), this.JobsController.adminCreateJob);

    this.router.get(`${this.path}`, this.JobsController.getJobs);

    this.router.get(`${this.path}/all`, adminAuthMiddleware, this.JobsController.getAllJobs);

    this.router.get(`${this.path}/:id`, this.JobsController.getJobsById);

    this.router.get(`${this.path}/:id/related`, this.JobsController.getRelatedJobs);

    this.router.get(`${this.path}/:business_id/jobs`, this.JobsController.getBusinessJobs);

    this.router.put(`${this.path}/:id`, this.JobsController.updateJobs);

    this.router.delete(`${this.adminPath}/:id`, adminAuthMiddleware, this.JobsController.deleteJobs);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.JobsController.deleteJobs);
  }
}

export { JobsRoute };
