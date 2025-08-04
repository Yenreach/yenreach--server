import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Index, JoinColumn } from 'typeorm';
import { SubPlan } from './subplan.entity';
import { Users } from './users.entity';
import { Businesses } from './businesses.entity';

@Entity('subscription_payment', { schema: 'yenreach' })
export class SubscriptionPayment {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'sub_plan_id' })
  public subPlanId: string;

  @Index()
  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  @Index()
  @Column('uuid', { name: 'user_id' })
  public userId: string;

  @Column('varchar', { name: "reference" })
  reference: string;

  @Column('varchar', { name: "status" })
  status: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })

  user: Users;

  @ManyToOne(() => Businesses, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })

  business: Businesses;

  @ManyToOne(() => SubPlan, subPlan => subPlan.payments, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sub_plan_id' })

  subPlan: SubPlan;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
