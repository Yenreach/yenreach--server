import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Businesses } from './businesses.entity';

@Entity('business_videos', { schema: 'yenreach' })
export class BusinessVideos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  @ManyToOne(() => Businesses, business => business.videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  public business: Businesses;

  @Column('varchar', { name: 'media_path', length: 500 })
  public mediaPath: string;

  @Column('varchar', { name: 'platform', length: 255 })
  public platform: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
