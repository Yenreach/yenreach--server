import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Products } from './product.entity';

@Entity('product_photos', { schema: 'yenreach' })
export class ProductPhotos {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index()
  @Column('uuid', { name: 'product_id' })
  public productId: string;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id' })
  public product: Products;

  @Column('varchar', { name: 'media_path', length: 500 })
  public mediaPath: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
