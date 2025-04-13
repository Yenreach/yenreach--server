import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Businesses } from './businesses.entity';
import { Users } from './users.entity';

@Entity('saved_business', { schema: 'yenreach' })
export class SavedBusinesses {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  @Column('uuid', { name: 'user_id' })
  public userId: string;

  @ManyToOne(() => Businesses)
  @JoinColumn({ name: 'business_id' })
  business: Businesses;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
