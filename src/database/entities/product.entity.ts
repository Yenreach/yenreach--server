import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProductPhotos } from './product-photos.entity';
import { Businesses } from './businesses.entity';
import { ProductStatus } from '../../modules/products/enums';
import { ProductCategories } from './product-category.entity';
import { BlackFridayDeals } from './black-friday-deals.entity';

@Entity('products', { schema: 'yenreach' })
export class Products {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  @Column('varchar', { name: 'product_string', length: 255, nullable: true })
  public productString: string;

  @Column('varchar', { name: 'name', length: 255 })
  public name: string;

  @Column('text', { name: 'description' })
  public description: string;

  @Column('int', { name: 'quantity' })
  public quantity: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'price' })
  price: number;

  @Column('varchar', { name: 'color', length: 255 })
  public color: string;

  @Column('text', { name: 'safety_tip' })
  public safetyTip: string;

  @Column('enum', { name: 'status', enum: ProductStatus, default: ProductStatus.Available })
  public status: ProductStatus;

  @ManyToOne(() => Businesses, (business: Businesses) => business.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  public business: Businesses;

  @OneToOne(() => BlackFridayDeals, (blackFridayDeal: BlackFridayDeals) => blackFridayDeal.product, { cascade: ['soft-remove', 'remove'] })
  public blackFridayDeal: BlackFridayDeals;

  @OneToMany(() => ProductCategories, (productCategory: ProductCategories) => productCategory.product, { cascade: ['soft-remove', 'remove'] })
  public categories: ProductCategories[];

  @OneToMany(() => ProductPhotos, productPhotos => productPhotos.product, { cascade: ['soft-remove', 'remove'] })
  public photos: ProductPhotos[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
