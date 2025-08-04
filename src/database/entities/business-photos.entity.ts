import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Businesses } from './businesses.entity';

@Entity('business_photos', { schema: 'yenreach' })
export class BusinessPhotos {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  @ManyToOne(() => Businesses, business => business.photos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  public business: Businesses;

  @Column('varchar', { name: 'media_path', length: 500 })
  public mediaPath: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
