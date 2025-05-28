import AppDataSource from '../../../core/database';
import { SubscriptionPayment } from '../../../core/database/postgres/payment.entity';
import axios from 'axios';
import { SubPlanService } from './subplan.service';

export class PaymentService {
  private repo = AppDataSource.getRepository(SubscriptionPayment);
  private subPlanService = new SubPlanService();

  async create(userId: string, businessId: string, subPlanId: string, amountPaid: number) {
    const payment = this.repo.create({
      userId,
      businessId,
      subPlan: { id: subPlanId },
      amountPaid,
    });
    return this.repo.save(payment);
  }

  findByUser(userId: string) {
    return this.repo.find({
      where: { userId },
      relations: ['subPlan', 'subPlan.plan'],
      order: { paymentDate: 'DESC' },
    });
  }

  async update(id: string, data: Partial<SubscriptionPayment>) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id }, relations: ['subPlan'] });
  }

  async delete(id: string) {
    return this.repo.delete(id);
  }

  async initiatePaystackPayment(userEmail: string, subPlanId: string) {
    const subPlan = await this.subPlanService.findById(subPlanId);
    if (!subPlan) throw new Error('SubPlan not found');

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: userEmail,
        amount: Number(subPlan.amount) * 100,
        metadata: {
          subPlanId: subPlan.id,
          plan: subPlan.plan.name,
          duration: subPlan.durationInMonths,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }
}
