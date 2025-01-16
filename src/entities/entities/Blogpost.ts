import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("blogpost", { schema: "yenreach" })
export class Blogpost {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "blog_string" })
  blogString: string;

  @Column("text", { name: "admin_string" })
  adminString: string;

  @Column("text", { name: "title" })
  title: string;

  @Column("text", { name: "author" })
  author: string;

  @Column("text", { name: "snippet" })
  snippet: string;

  @Column("text", { name: "post" })
  post: string;

  @Column("text", { name: "file_path" })
  filePath: string;

  @Column("tinyint", { name: "priority", width: 1, default: () => "'0'" })
  priority: boolean;

  @Column("int", { name: "created_at" })
  createdAt: number;

  @Column("int", { name: "updated_at" })
  updatedAt: number;
}
