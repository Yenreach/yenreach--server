import { Entity, Index, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { Products } from './product.entity';

@Entity('black_friday_deals', { schema: 'yenreach' })
export class BlackFridayDeals {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column('uuid', { name: 'product_id' })
  public productId: string;

  @Column({ name: 'created_at', type: 'timestamptz', nullable: true })
  public dealEndDate: Date;

  @Column('decimal', { precision: 10, scale: 2, name: 'discounted_price' })
  discountedPrice: number;

  @Column('decimal', { precision: 4, scale: 2, name: 'discount_percentage' })
  discountPercentage: number;

  @OneToOne(() => Products, (product: Products) => product.blackFridayDeal, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'prouduct_id' })
  public product: Products;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
