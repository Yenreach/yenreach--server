// src/modules/subscription/controllers/plan.controller.ts
import { Request, Response } from 'express';
import { PlanService } from '../services';


export class PlanController {
  private service = new PlanService();

  public create = async (req: Request, res: Response) => {
    try {
      const plan = await this.service.create(req.body);
      res.status(201).json(plan);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to create plan', details: err.message });
    }
  }

  public findAll = async (req: Request, res: Response) => {
    try {
      const plans = await this.service.findAll();
      res.json(plans);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch plans', details: err.message });
    }
  }

  public update = async (req: Request, res: Response) => {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update plan', details: err.message });
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete plan', details: err.message });
    }
  }
};
