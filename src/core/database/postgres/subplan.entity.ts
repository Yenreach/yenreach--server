import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Plan } from './plan.entity';
import { SubscriptionPayment } from './payment.entity';

@Entity()
export class SubPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Basic, Pro, X

  @Column()
  durationInMonths: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Plan, plan => plan.subPlans, { onDelete: 'CASCADE' })
  plan: Plan;

  @OneToMany(() => SubscriptionPayment, payment => payment.subPlan)
  payments: SubscriptionPayment[];
}
