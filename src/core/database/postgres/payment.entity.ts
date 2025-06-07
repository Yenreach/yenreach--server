import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { SubPlan } from './subplan.entity';
import { Users } from './users.entity';
import { Businesses } from './businesses.entity';

@Entity('subscription_payment', { schema: 'yenreach' })
export class SubscriptionPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  user: Users;

  @ManyToOne(() => Businesses, { onDelete: 'CASCADE' })
  business: Businesses;

  @ManyToOne(() => SubPlan, subPlan => subPlan.payments, { onDelete: 'SET NULL' })
  subPlan: SubPlan;

  @Column()
  reference: string;

  @Column()
  status: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  paymentDate: Date;
}
