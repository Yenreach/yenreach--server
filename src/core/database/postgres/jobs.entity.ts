import {
  Admin,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Businesses } from './businesses.entity';
import { Admins } from './admin.entity';
import { JobTags } from './job-tags.entity';
import { JobStatus } from '../../../modules/jobs/enums';

@Entity('jobs', { schema: 'yenreach' })
export class Jobs {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column('uuid', { name: 'business_id', nullable: true })
  public businessId: string;

  @Column('varchar', { name: 'job_string', length: 255 })
  public jobString: string;

  @Column('uuid', { name: 'admin_id', nullable: true })
  public adminId: string;

  @Column('varchar', { name: 'company_name', length: 255 })
  public companyName: string;

  @Column('varchar', { name: 'tittle', length: 255 })
  public title: string;

  @Column('varchar', { name: 'type', length: 355 })
  public type: string;

  @Column('varchar', { name: 'location', length: 255 })
  public location: string;

  @Column('varchar', { name: 'salary', length: 255 })
  public salary: string;

  @Column('text', { name: 'description' })
  public description: string;

  @Column('text', { name: 'benefit' })
  public benefit: boolean;

  @Column('enum', { name: 'status', enum: JobStatus })
  public status: JobStatus;

  @Column('boolean', { name: 'is_admin_job', default: false })
  public isAdminJob: boolean;

  @Column('text', { name: 'application_method' })
  public applicationMethod: string;

  @OneToMany(() => JobTags, jobTags => jobTags.job)
  public tags: JobTags[];

  @ManyToOne(() => Businesses)
  @JoinColumn({ name: 'business_id' })
  public business?: Businesses;

  @ManyToOne(() => Admins)
  @JoinColumn({ name: 'admin_id' })
  public admin?: Admins;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
