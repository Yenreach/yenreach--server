import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { Admins } from './admin.entity';

@Entity('blogs', { schema: 'yenreach_schema' })
export class Blogs {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('varchar', { name: 'name', length: 100 })
  public name: string;

  @Column('uuid', { name: 'author_id' })
  public authorId: string;

  //   @Column('varchar', { name: 'blog_string', length: 500 })
  //   public blogString: string;

  //   @Column('varchar', { name: 'admin_string', length: 500 })
  //   public admingString: string;

  @Column('varchar', { name: 'tittle', length: 500 })
  public tittle: string;

  @Column('text', { name: 'preview' })
  public preview: string;

  @Column('varchar', { name: 'media_url', length: 200 })
  public media_url: string;

  @Column('text', { name: 'content' })
  public content: string;

  @Column('boolean', { name: 'is_featured', default: false })
  public isFeatured: string;

  @ManyToOne(() => Admins)
  @JoinColumn({ name: 'author_id' })
  public author: Admins;

  @OneToMany(() => Comments, (comments: Comments) => comments.blog)
  public comments: Comments[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
