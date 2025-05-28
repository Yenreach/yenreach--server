import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { SubPlan } from './subplan.entity';

@Entity()
export class SubscriptionPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  businessId: string;

  @ManyToOne(() => SubPlan, subPlan => subPlan.payments, { onDelete: 'SET NULL' })
  subPlan: SubPlan;

  @Column('decimal', { precision: 10, scale: 2 })
  amountPaid: number;

  @CreateDateColumn()
  paymentDate: Date;
}
