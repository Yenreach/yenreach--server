import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Businesses } from './businesses.entity';

@Entity('business_reviews', { schema: 'yenreach' })
export class BusinessReviews {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  @Column('uuid', { name: 'user_id' })
  public userId: string;

  @ManyToOne(() => Businesses, business => business.reviews)
  @JoinColumn({ name: 'business_id' })
  public business: Businesses;

  @Column('text', { name: 'review' })
  public review: string;

  @Column('smallint', { name: 'star' })
  public star: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
