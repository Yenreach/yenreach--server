import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Businesses } from './businesses.entity';

@Entity('business_of_the_week')
export class BusinessOfTheWeek {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'business_id' })
  businessId: string;

  @ManyToOne(() => Businesses, { eager: true })
  @JoinColumn({ name: 'business_id' })
  business: Businesses;

  @Index()
  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;

  @Index()
  @Column({ type: 'timestamptz', name: 'start_date' })
  startDate: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
