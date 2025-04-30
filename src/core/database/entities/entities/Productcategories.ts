import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productcategories', { schema: 'yenreach' })
export class Productcategories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'category_string' })
  categoryString: string;

  @Column('text', { name: 'category' })
  category: string;

  @Column('text', { name: 'product_string' })
  productString: string;

  @Column('int', { name: 'created_at' })
  createdAt: number;

  @Column('int', { name: 'updated_at' })
  updatedAt: number;
}
