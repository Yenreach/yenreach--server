import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { BusinessCategories } from './business-categories.entity';

@Entity('categories', { schema: 'public' })
export class Categories {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { name: 'parent_category_id', nullable: true })
  public parentCategoryId: string;

  @Column('varchar', { name: 'verify_string' })
  public verifyString: string;

  @Column('varchar', { name: 'category', length: 100 })
  public category: string;

  @ManyToOne(() => Categories)
  @JoinColumn({ name: 'parent_category_id' })
  public categories: Categories[];

  @OneToMany(() => BusinessCategories, businessCategory => businessCategory.business)
  businessCategories: BusinessCategories[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
