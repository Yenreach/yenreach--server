import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Users } from './users.entity';
import { Businesses } from './businesses.entity';
import { BillboardStatus } from '../../shared/enums/common.enum';
import { Admins } from './admin.entity';

@Entity('billboard_entries')
export class BillboardEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ name: 'admin_id', type: 'uuid', nullable: true })
  adminId: string | null;

  @ManyToOne(() => Admins, { nullable: true })
  @JoinColumn({ name: 'admin_id' })
  admin: Admins;

  @Column({ name: 'business_id', type: 'uuid', nullable: true })
  businessId: string | null;

  @ManyToOne(() => Businesses, { nullable: true })
  @JoinColumn({ name: 'business_id' })
  business: Businesses;

  @Column({ name: 'title', type: 'varchar', length: 100 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', type: 'varchar', length: 255 })
  imageUrl: string;

  @Column({ name: 'cta_text', type: 'varchar', length: 255, nullable: true })
  ctaText: string;

  @Column({ name: 'cta_link', type: 'varchar', length: 255, nullable: true })
  ctaLink: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: BillboardStatus,
    default: BillboardStatus.Pending,
  })
  status: BillboardStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
