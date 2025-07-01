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

@Entity('blogs', { schema: 'yenreach' })
export class Blogs {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { name: 'author_id' })
  public authorId: string;

  @Column('varchar', { name: 'title', length: 500 })
  public title: string;

  @Column('text', { name: 'preview' })
  public preview: string;

  @Column('varchar', { name: 'media_url', length: 200 })
  public mediaUrl: string;

  @Column('text', { name: 'content' })
  public content: string;

  @Column('boolean', { name: 'is_featured', default: false })
  public isFeatured: boolean;

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
