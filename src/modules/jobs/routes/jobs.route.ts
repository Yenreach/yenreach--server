import { Request, Response, NextFunction, Router } from 'express';
import { JobsController } from '../controllers';
import { Routes } from '../../../core/routes/interfaces';
import { authMiddleware } from '../../../core/middlewares';
import { validateRequest } from '../../../core/middlewares/ValidationMiddleware';
import { JobSchema } from '../schemas/jobs.schema';

class JobsRoute implements Routes {
  public path = '/jobs';
  public router = Router();
  public JobsController = new JobsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.all(`${this.path}*`, (req: Request, res: Response, next: NextFunction) => {
      next()
    })

    this.router.post(`${this.path}/`, authMiddleware, validateRequest([JobSchema]), this.JobsController.createJobs)

    this.router.get(`${this.path}/`, this.JobsController.getAllJobs)

    this.router.get(`${this.path}/:id`, this.JobsController.getJobsById)

    this.router.put(`${this.path}/:id`, this.JobsController.updateJobs)

    this.router.delete(`${this.path}/:id`, this.JobsController.deleteJobs)
  }
}

export { JobsRoute };

