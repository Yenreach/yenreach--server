import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Plan } from './plan.entity';
import { SubscriptionPayment } from './payment.entity';

@Entity('sub_plan', { schema: 'yenreach' })
export class SubPlan {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'plan_id' })
  public planId: string;

  @Column('varchar', { name: 'name' })
  name: string; // Basic, Pro, X

  @Column('int', { name: 'duration_in_months' })
  durationInMonths: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Plan, plan => plan.subPlans, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToMany(() => SubscriptionPayment, payment => payment.subPlan)
  payments: SubscriptionPayment[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
