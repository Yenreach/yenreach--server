import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Businesses } from './businesses.entity';
import { Categories } from './category.entity';

@Entity('business_categories', { schema: 'yenreach' })
export class BusinessCategories {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'category_id' })
  public categoryId: string;

  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  @ManyToOne(() => Businesses, business => business.categories)
  @JoinColumn({ name: 'business_id' })
  public business: Businesses;

  @ManyToOne(() => Categories, category => category.businesses)
  @JoinColumn({ name: 'category_id' })
  public category: Categories;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
