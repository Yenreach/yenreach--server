import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("emaillist", { schema: "yenreach" })
export class Emaillist {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "admin_string" })
  adminString: string;

  @Column("text", { name: "title" })
  title: string;

  @Column("text", { name: "content" })
  content: string;

  @Column("int", { name: "created" })
  created: number;
}
