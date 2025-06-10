import AppDataSource from '../../../core/database';
import { SubscriptionPayment } from '../../../core/database/postgres/payment.entity';
import axios from 'axios';
import { SubPlanService } from './subplan.service';
import { CreatePaymentDto, UpdatePaymentDto } from '../schemas';
import { CardToken } from '../../../core/database/postgres/card-token.entity';
import { Users } from '../../../core/database/postgres/users.entity';
import { HttpException } from '../../../core/exceptions';
import env from '../../../config/env.config';
import { uuid } from "uuidv4";
import { SubPlan } from '../../../core/database/postgres/subplan.entity';

export class PaymentService {
  private repo = AppDataSource.getRepository(SubscriptionPayment);
  private cardTokenRepo = AppDataSource.getRepository(CardToken);
  private userRepo = AppDataSource.getRepository(Users);
  private subPlanService = new SubPlanService();

  async create(data: CreatePaymentDto) {
    const payment = this.repo.create({
      ...data
    });
    const savedPayment = this.repo.save(payment);
    return savedPayment;
  }

  findByUser(userId: string) {
    const payments = this.repo.find({
      where: { user: { id: userId } },
      relations: ['subPlan', 'subPlan.plan'],
      order: { createdAt: 'DESC' },
    });
    return payments;
  }

  async update(id: string, data: Partial<UpdatePaymentDto>) {
    await this.repo.update(id, data);
    const updatedPayment = this.repo.findOne({ where: { id }, relations: ['subPlan'] });
    return updatedPayment;
  }

  async delete(id: string) {
    const result = this.repo.delete(id);
    return result;
  }

  async initiateFlutterwavePayment(payload: {
    userId: string;
    businessId: string;
    subPlanId: string;
    redirectUrl: string;
  }) {
    const tx_ref = uuid();

    // Fetch SubPlan details from the database
    const subPlanRepository = AppDataSource.getRepository(SubPlan);
    const subPlan = await subPlanRepository.findOne({
      where: { id: payload.subPlanId },
    });

    if (!subPlan) {
      throw new Error("SubPlan not found");
    }

    // Fetch User details from the database
    const userRepository = AppDataSource.getRepository(Users);
    const user = await userRepository.findOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Send payment request to Flutterwave
    const res = await axios.post(
      `https://api.flutterwave.com/v3/payments`,
      {
        tx_ref,
        amount: subPlan.amount, // Use amount from the SubPlan entity
        currency: "NGN",
        redirect_url: payload.redirectUrl,
        customer: {
          email: user.email, // Use email from the User entity
        },
        customizations: {
          title: "Subscription Payment",
          description: "Subscription for a selected plan",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${env.FLW_TEST_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      paymentLink: res.data?.data?.link,
      reference: tx_ref,
    };
  }

  async verifyPayment(txRef: string) {
    try {
      const response = await axios.get(
        `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`,
        {
          headers: {
            Authorization: `Bearer ${env.FLW_TEST_KEY}`,
          },
        }
      );

      const txData = response.data.data;

      if (txData.status === 'successful') {
        // Save payment record
        const payment = this.create({
          reference: txData.tx_ref,
          amount: txData.amount,
          status: 'success',
          userId: txData.meta?.userId,
          businessId: txData.meta?.businessId,
          subPlanId: txData.meta?.subPlanId,
        });


        // Save card token if available
        if (txData.card?.token) {
          const user = await this.userRepo.findOne({
            where: { id: txData.meta?.userId },
            relations: ['cardTokens'],
          });

          if (!user) {
            throw new HttpException(404, 'User not found');
          }

          const newCardToken = this.cardTokenRepo.create({
            token: txData.card.token,
            last4: txData.card.last4digits,
            cardType: txData.card.type,
            user: user,
            isDefault: true,
            expiry: txData.card.expiry,
          });

          // Unset existing default cards
          await this.cardTokenRepo.update(
            { user: user, isDefault: true },
            { isDefault: false }
          );

          await this.cardTokenRepo.save(newCardToken);

          return { payment, cardToken: newCardToken };
        }

        return { payment };
      } else {
        throw new HttpException(400, 'Transaction not successful');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new HttpException(500, 'Failed to verify payment');
    }
  }

}
