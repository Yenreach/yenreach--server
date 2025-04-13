import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Categories } from './category.entity';

import { Products } from './product.entity';

@Entity('product_categories', { schema: 'yenreach' })
export class ProductCategories {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { name: 'category_id' })
  public categoryId: string;

  @Column('uuid', { name: 'business_id' })
  public productId: string;

  @ManyToOne(() => Products, (product: Products) => product)
  @JoinColumn({ name: 'business_id' })
  public product: Products;

  @ManyToOne(() => Categories, category => category.productCategories)
  @JoinColumn({ name: 'category_id' })
  public category: Categories;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
