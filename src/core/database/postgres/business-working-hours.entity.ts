import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Businesses } from './businesses.entity';

@Entity('business_working_hours', { schema: 'yenreach' })
export class BusinessWorkingHours {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  @ManyToOne(() => Businesses)
  @JoinColumn({ name: 'business_id' })
  public business: Businesses;

  @Column('varchar', { name: 'days', length: 255 })
  public days: string;

  @Column('varchar', { name: 'opening_time', length: 255 })
  public opening_time: string;

  @Column('varchar', { name: 'closing_time', length: 255 })
  public closing_time: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
