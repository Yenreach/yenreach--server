import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("comments", { schema: "yenreach" })
export class Comments {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "comment_string" })
  commentString: string;

  @Column("text", { name: "blog_string" })
  blogString: string;

  @Column("text", { name: "author_string" })
  authorString: string;

  @Column("text", { name: "author" })
  author: string;

  @Column("text", { name: "comment" })
  comment: string;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
