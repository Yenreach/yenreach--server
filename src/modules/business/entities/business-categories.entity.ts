import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('business_categories', { schema: 'yenreach' })
export class Businesscategories {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'verify_string', length: 255 })
  verifyString: string;

  @Column('varchar', { name: 'category_string', length: 255 })
  categoryString: string;

  @Column('varchar', { name: 'category', length: 1000 })
  category: string;

  @Column('varchar', { name: 'business_string', length: 255 })
  businessString: string;

  @Column('int', { name: 'created' })
  created: number;

  @Column('int', { name: 'last_updated' })
  lastUpdated: number;
}
