import { Request, Response } from 'express';
import { SubPlanService } from '../services';


export class SubPlanController {
  private service = new SubPlanService();
  public create = async (req: Request, res: Response) => {
    try {
      const subPlan = await this.service.create(req.body);
      res.status(201).json(subPlan);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create sub plan', details: err.message });
    }
  }

  public findAll = async (req: Request, res: Response) => {
    try {
      const subPlans = await this.service.findAll();
      res.json(subPlans);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch sub plans', details: err.message });
    }
  }

  public update = async (req: Request, res: Response) => {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update sub plan', details: err.message });
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete sub plan', details: err.message });
    }
  }
};
