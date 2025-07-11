import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FeedbackStatus } from '../../../shared/enums';

@Entity('feedbacks', { schema: 'yenreach' })
export class Feedbacks {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'name', length: 255 })
  public name: string;

  @Column('varchar', { name: 'email', length: 255 })
  public email: string;

  @Column('varchar', { name: 'subject', length: 255 })
  public subject: string;

  @Column('text', { name: 'message' })
  public message: string;

  @Column('enum', { name: 'status', enum: FeedbackStatus, default: FeedbackStatus.Pending })
  public status: FeedbackStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
