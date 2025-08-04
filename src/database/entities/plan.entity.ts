import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { SubPlan } from './subplan.entity';

@Entity('plan', { schema: 'yenreach' })
export class Plan {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column('int', { name: 'video_limit' })
  videoLimit: number;

  @Column('int', { name: 'slider_limit' })
  sliderLimit: number;

  @Column('int', { name: 'branch_limit' })
  branchLimit: number;

  @Column('int', { name: 'social_media_limit' })
  socialMediaLimit: number;

  @Column('int', { name: 'order' })
  order: number;

  @OneToMany(() => SubPlan, subPlan => subPlan.plan)
  subPlans: SubPlan[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
