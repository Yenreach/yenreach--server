import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Jobs } from './jobs.entity';

@Entity('job_tags', { schema: 'yenreach' })
export class JobTags {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { name: 'job_id' })
  public jobId: string;

  @Column('varchar', { name: 'tag', length: 255 })
  public tag: string;

  @ManyToOne(() => Jobs, (jobs: Jobs) => jobs.tags)
  @JoinColumn({ name: 'job_id' })
  public job: Jobs;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
