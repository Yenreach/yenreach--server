import { Request, Response } from 'express';
import { PaymentService } from '../services';

export class PaymentController {
  private service = new PaymentService();

  public create = async (req: Request, res: Response) => {
    try {
      const { userId, businessId, subPlanId, amountPaid } = req.body;
      const payment = await this.service.create(userId, businessId, subPlanId, amountPaid);
      res.status(201).json(payment);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to record payment', details: err.message });
    }
  }

  public findByUser = async (req: Request, res: Response) => {
    try {
      const payments = await this.service.findByUser(req.params.userId);
      res.json(payments);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch payments', details: err.message });
    }
  }

  public initiatePaystack = async (req: Request, res: Response) => {
    try {
      const { email, subPlanId } = req.body;
      const response = await this.service.initiatePaystackPayment(email, subPlanId);
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to initiate payment', details: err.message });
    }
  }

  public update = async (req: Request, res: Response) => {
    try {
      const updated = await this.service.update(req.params.id, req.body);
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update payment', details: err.message });
    }
  }

  public delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to delete payment', details: err.message });
    }
  }
}
