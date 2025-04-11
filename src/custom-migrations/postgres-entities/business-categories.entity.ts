import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Businesses } from './businesses.entity';
import { Categories } from './category.entity';

@Entity('business_categories', { schema: 'yenreach' })
export class BusinessCategories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'verify_string', length: 255 })
  verifyString: string;

  @Column('uuid', { name: 'category_id' })
  public categoryId: string;

  @Column('uuid', { name: 'business_id' })
  public businessId: string;

  //   @Column('varchar', { name: 'category_string', length: 255 })
  //   categoryString: string;

  //   @Column('varchar', { name: 'category', length: 1000 })
  //   categoryName: string;

  //   @Column('varchar', { name: 'business_string', length: 255 })
  //   businessString: string;

  @ManyToOne(() => Businesses, business => business.businessCategories)
  @JoinColumn({ name: 'business_id' })
  business: Businesses;

  @ManyToOne(() => Categories, category => category.businessCategories)
  @JoinColumn({ name: 'category_id' })
  category: Categories;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
