import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Blogs } from './blogs.entity';
import { Users } from './users.entity';

@Entity('comments', { schema: 'yenreach' })
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column('uuid', { name: 'author_id' })
  public authorId: string;

  @Column('uuid', { name: 'blog_id' })
  public blogId: string;

  @Column('text', { name: 'content' })
  public comment: string;

  @ManyToOne(() => Blogs, (blogs: Blogs) => blogs.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  public blog: Blogs;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'author_id' })
  public author: Users;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  public updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  public deletedAt: Date;
}
