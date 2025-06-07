import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubPlan } from './subplan.entity';

@Entity('plan', { schema: 'yenreach' })
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  numberOfVideos: number;

  @Column()
  numberOfSliders: number;

  @Column()
  numberOfBranches: number;

  @Column()
  numberOfSocialMediaLinks: number;

  @Column()
  order: number;

  @OneToMany(() => SubPlan, subPlan => subPlan.plan)
  subPlans: SubPlan[];
}
